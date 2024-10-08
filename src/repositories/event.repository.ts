import { Event, Prisma, PrismaClient, StatusEvent } from '@prisma/client';
import { CreateEventReq, UpdateEventReq } from '../types/apps/event.type';
import { Error400, Error404 } from '../errors/http.errors';

export class EventRepository {
  name = 'eventRepository';
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createEvent(data: CreateEventReq) {
    try {
      const { images, date, ...eventData } = data;

      const eventDate = new Date(date);

      const transaction = await this.db.$transaction(async (prisma) => {
        const event = await prisma.event.create({
          data: {
            status: StatusEvent.in_progress,
            slotsAvailable: eventData.slotsNeeded,
            date: eventDate,
            ...eventData,
          },
        });

        if (images && images.length > 0) {
          const eventImages = images.map((image) => ({
            eventId: event.id,
            value: image,
          }));
          await prisma.image.createMany({
            data: eventImages,
          });
        }

        return event;
      });
      return transaction;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          const fieldName = error.meta?.field_name;
          throw new Error400({
            message: `The provided ${fieldName} does not exist, please provide a valid ${fieldName}`,
          });
        }
      }
      throw error;
    }
  }

  async getEvents({
    organizerId,
    categoryEventId,
    status,
    limit = 10,
    offset = 0,
    search,
  }: {
    organizerId?: number;
    categoryEventId?: number;
    status?: StatusEvent;
    limit?: number;
    offset?: number;
    search: string;
  }): Promise<{
    events: Omit<
      Event,
      'organizerId' | 'provinceId' | 'regencyId' | 'categoryEventId' | 'createdAt' | 'updatedAt'
    >[];
    total: number;
  }> {
    const total = await this.db.event.count({
      where: {
        title: { contains: search, mode: 'insensitive' },
        ...(organizerId && { organizerId }),
        ...(categoryEventId && { categoryEventId }),
        ...(status && { status }),
      },
    });

    const take = limit === -1 ? undefined : limit;
    const skip = limit === -1 ? undefined : offset;

    const events = await this.db.event.findMany({
      where: {
        title: { contains: search, mode: 'insensitive' },
        ...(organizerId && { organizerId }),
        ...(categoryEventId && { categoryEventId }),
        ...(status && { status }),
      },
      select: {
        id: true,
        title: true,
        description: true,
        additionalInfo: true,
        date: true,
        location: true,
        slotsNeeded: true,
        slotsAvailable: true,
        status: true,
        organizer: true,
        province: true,
        regency: true,
        category: true,
        images: true,
      },
      take,
      skip,
      orderBy: { id: 'desc' },
    });

    return { events, total };
  }

  async getEventById(id: number) {
    return this.db.event.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        additionalInfo: true,
        date: true,
        location: true,
        slotsNeeded: true,
        slotsAvailable: true,
        status: true,
        organizer: true,
        province: true,
        regency: true,
        category: true,
        images: true,
      },
    });
  }

  async updatePutEvent(id: number, data: UpdateEventReq) {
    const { newImages, delImages, date, ...eventData } = data;

    const eventDate = new Date(date);

    try {
      const transaction = await this.db.$transaction(async (prisma) => {
        const updatedEvent = await prisma.event.update({
          where: { id },
          data: {
            ...eventData,
            date: eventDate,
          },
        });

        if (newImages && newImages.length > 0) {
          const newEventImages = newImages.map((image) => ({
            eventId: id,
            value: image,
          }));

          await prisma.image.createMany({
            data: newEventImages,
          });
        }

        if (delImages && delImages.length > 0) {
          await prisma.image.deleteMany({
            where: {
              eventId: id,
              value: { in: delImages },
            },
          });
        }

        return updatedEvent;
      });

      return transaction;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          const fieldName = error.meta?.field_name;
          throw new Error400({
            message: `The provided ${fieldName} does not exist, please provide a valid ${fieldName}`,
          });
        } else if (error.code === 'P2025') {
          throw new Error404({
            message: `Event with id ${id} not found.`,
          });
        }
      }
      throw error;
    }
  }

  async updateEventStatus(id: number, status: StatusEvent) {
    try {
      const event = await this.db.event.update({
        where: { id },
        data: { status },
      });

      return event;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error404({
            message: `Event with id ${id} not found.`,
          });
        }
      }
      throw error;
    }
  }
}

export default EventRepository;
