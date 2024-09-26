import { Event } from '@prisma/client';

export type CreateEventReq = Omit<
  Event,
  'id' | 'status' | 'slotsAvailable' | 'createdAt' | 'updatedAt'
> & {
  images: string[];
};
