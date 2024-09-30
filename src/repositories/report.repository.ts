import { Prisma, PrismaClient, Report } from '@prisma/client';
import { CreateReportReq } from '../types/apps/report.type';
import { Error400 } from '../errors/http.errors';

export class ReportRepository {
  name = 'reportRepository';
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createReport(data: CreateReportReq) {
    try {
      const report = await this.db.report.create({ data });

      return report;
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

  async getReports({
    eventId,
    limit = 10,
    offset = 0,
  }: {
    eventId: number;
    limit?: number;
    offset?: number;
  }): Promise<{
    total: number;
    reports: Omit<Report, 'eventId' | 'volunteerId' | 'createdAt'>[];
  }> {
    const total = await this.db.report.count({
      where: { eventId },
    });

    const take = limit === -1 ? undefined : limit;
    const skip = limit === -1 ? undefined : offset;

    const reports = await this.db.report.findMany({
      where: { eventId },
      take,
      skip,
      include: {
        volunteer: {
          select: {
            id: true,
            fullname: true,
            username: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return {
      reports,
      total,
    };
  }

  async updateReport(id: number, feedback: string) {
    try {
      const report = await this.db.report.update({
        where: { id },
        data: { feedback },
      });
      return report;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error400({
            message: `Report with id ${id} not found.`,
          });
        }
      }
      throw error;
    }
  }
}

export default ReportRepository;
