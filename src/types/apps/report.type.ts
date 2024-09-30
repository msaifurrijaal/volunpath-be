import { Report } from '@prisma/client';

export type CreateReportReq = Omit<Report, 'id' | 'createdAt'>;
