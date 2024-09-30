import { z } from 'zod';
import ReportRepository from '../repositories/report.repository';
import { CreateReportReq } from '../types/apps/report.type';
import { Error400 } from '../errors/http.errors';

export class ReportService {
  name = 'reportService';
  reportRepository: ReportRepository;

  constructor(ctx: { repositories: { reportRepository: ReportRepository } }) {
    this.reportRepository = ctx.repositories.reportRepository;
  }

  async createReport(data: CreateReportReq) {
    const schema = z.object({
      eventId: z.number({ required_error: 'Event ID is required' }),
      volunteerId: z.number({ required_error: 'Volunteer ID is required' }),
      feedback: z.string({ required_error: 'Feedback is required' }),
    });

    const parsedData = schema.safeParse(data);
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    return this.reportRepository.createReport(data);
  }

  async getReports({
    eventId,
    limit,
    offset,
  }: {
    eventId: number;
    limit?: number;
    offset?: number;
  }) {
    const schema = z.object({
      eventId: z.number({ required_error: 'Event ID is required' }),
      limit: z.number().optional(),
      offset: z.number().optional(),
    });

    const parsedData = schema.safeParse({ eventId, limit, offset });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    return this.reportRepository.getReports({
      eventId,
      limit,
      offset,
    });
  }

  async updatePatchReport(id: number, feedback: string) {
    const schema = z.object({
      id: z.number({ required_error: 'Report ID is required' }),
      feedback: z.string({ required_error: 'Feedback is required' }),
    });

    const parsedData = schema.safeParse({ id, feedback });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    return this.reportRepository.updateReport(id, feedback);
  }
}

export default ReportService;
