import { Activity } from '@prisma/client';

export type CreateActivityReq = Omit<
  Activity,
  'id' | 'status' | 'statusPayment' | 'createdAt' | 'updatedAt'
>;
