import { z } from 'zod';
import EventRepository from '../repositories/event.repository';
import { CreateEventReq, UpdateEventReq } from '../types/apps/event.type';
import { Error400, Error404 } from '../errors/http.errors';
import { StatusEvent } from '@prisma/client';
import SupabaseConnector from '../connectors/supabase.connector';

export class EventService {
  name = 'eventService';
  eventRepository: EventRepository;
  supabaseConnector: SupabaseConnector;

  constructor(ctx: {
    repositories: { eventRepository: EventRepository };
    connectors: { supabaseConnector: SupabaseConnector };
  }) {
    this.eventRepository = ctx.repositories.eventRepository;
    this.supabaseConnector = ctx.connectors.supabaseConnector;
  }

  async createEvent(data: CreateEventReq) {
    const schema = z.object({
      organizerId: z.number({ required_error: 'Organizer ID is required' }),
      title: z.string({ required_error: 'Title is required' }),
      description: z.string({ required_error: 'Description is required' }),
      additionalInfo: z.string().optional(),
      date: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(date), {
        message: 'Date must be in the format YYYY-MM-DDTHH:MM:SS',
      }),
      location: z.string({ required_error: 'Location is required' }),
      provinceId: z.number({ required_error: 'Province ID is required' }),
      regencyId: z.number({ required_error: 'Regency ID is required' }),
      slotsNeeded: z.number({ required_error: 'Slots needed is required' }),
      categoryEventId: z.number({ required_error: 'Category event ID is required' }),
      images: z.array(z.string()).optional(),
    });

    const parsedData = schema.safeParse(data);
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    return this.eventRepository.createEvent(data);
  }

  async getEvents({
    organizerId,
    categoryEventId,
    status,
    limit,
    offset,
    search,
  }: {
    organizerId?: number;
    categoryEventId?: number;
    status?: StatusEvent;
    limit?: number;
    offset?: number;
    search: string;
  }) {
    const schema = z.object({
      organizerId: z.number().optional(),
      categoryEventId: z.number().optional(),
      status: z.nativeEnum(StatusEvent).optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
      search: z.string().optional(),
    });

    const parsedData = schema.safeParse({
      organizerId,
      categoryEventId,
      status,
      limit,
      offset,
      search,
    });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    return this.eventRepository.getEvents({
      organizerId,
      categoryEventId,
      status,
      limit,
      offset,
      search,
    });
  }

  async getEventById(id: number) {
    const schema = z.object({
      id: z.number({ required_error: 'Event ID is required' }),
    });

    const parsedData = schema.safeParse({ id });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    const event = await this.eventRepository.getEventById(id);
    if (!event) {
      throw new Error404({ message: 'Event not found' });
    }

    return event;
  }

  async updatePutEvent(id: number, data: UpdateEventReq) {
    const schema = z.object({
      id: z.number({ required_error: 'Event ID is required' }),
    });

    const parsedData = schema.safeParse({ id });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    const result = await this.eventRepository.updatePutEvent(id, data);
    data.delImages?.forEach(async (image) => {
      await this.supabaseConnector.deleteFile(image);
    });

    return result;
  }

  async updateEventStatus(id: number, status: StatusEvent) {
    const schema = z.object({
      id: z.number({ required_error: 'Event ID is required' }),
      status: z.enum(['open_registration', 'in_progress', 'completed', 'canceled'], {
        required_error: 'Valid status is required',
      }),
    });

    const parsedData = schema.safeParse({ id, status });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    return await this.eventRepository.updateEventStatus(id, status);
  }
}

export default EventService;
