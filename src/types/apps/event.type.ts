import { Event } from '@prisma/client';

export type CreateEventReq = Omit<
  Event,
  'id' | 'status' | 'slotsAvailable' | 'createdAt' | 'updatedAt'
> & {
  images: string[];
};

export type UpdateEventReq = Omit<Event, 'id' | 'organizerId' | 'createdAt' | 'updatedAt'> & {
  newImages: string[];
  delImages: string[];
};
