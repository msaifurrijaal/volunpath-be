import { z } from 'zod';
import ReportRepository from '../repositories/report.repository';
import { CreateReportReq } from '../types/apps/report.type';
import { validateSchema } from '../helpers/validateSchema';

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

    validateSchema(schema, data);

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

    validateSchema(schema, { eventId, limit, offset });

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

    validateSchema(schema, { id, feedback });
    return this.reportRepository.updateReport(id, feedback);
  }

  async deleteReport(id: number) {
    const schema = z.object({
      id: z.number({ required_error: 'Report ID is required' }),
    });

    validateSchema(schema, { id });
    return this.reportRepository.deleteReport(id);
  }
}

export default ReportService;
