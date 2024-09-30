import { Activity, Prisma, PrismaClient, StatusActivity, StatusPayment } from '@prisma/client';
import { CreateActivityReq } from '../types/apps/activity.type';
import { Error400 } from '../errors/http.errors';

export class ActivityRepository {
  name = 'activityRepository';
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async createActivity(data: CreateActivityReq) {
    try {
      return await this.db.activity.create({
        data: {
          status: StatusActivity.pending,
          statusPayment: StatusPayment.pending,
          ...data,
        },
      });
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

  async getActivities({
    volunteerId,
    eventId,
    status,
    statusPayment,
    limit = 10,
    offset = 0,
    search,
  }: {
    volunteerId?: number;
    eventId?: number;
    status?: StatusActivity;
    statusPayment?: StatusPayment;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<{
    activities: Omit<Activity, 'volunteerId' | 'eventId' | 'createdAt' | 'updatedAt'>[];
    total: number;
  }> {
    const total = await this.db.activity.count({
      where: {
        ...(volunteerId && { volunteerId }),
        ...(eventId && { eventId }),
        ...(status && { status }),
        ...(statusPayment && { statusPayment }),
        ...(search && {
          OR: [
            {
              volunteer: {
                fullname: { contains: search, mode: 'insensitive' },
              },
            },
            {
              event: {
                title: { contains: search, mode: 'insensitive' },
              },
            },
          ],
        }),
      },
    });

    const take = limit === -1 ? undefined : limit;
    const skip = limit === -1 ? undefined : offset;

    const activities = await this.db.activity.findMany({
      where: {
        ...(volunteerId && { volunteerId }),
        ...(eventId && { eventId }),
        ...(status && { status }),
        ...(statusPayment && { statusPayment }),
        ...(search && {
          OR: [
            {
              volunteer: {
                fullname: { contains: search, mode: 'insensitive' },
              },
            },
            {
              event: {
                title: { contains: search, mode: 'insensitive' },
              },
            },
          ],
        }),
      },
      select: {
        id: true,
        status: true,
        statusPayment: true,
        motivation: true,
        additionalInfo: true,
        volunteer: true,
        event: true,
      },
      take,
      skip,
      orderBy: { id: 'desc' },
    });

    return { activities, total };
  }

  async getActivityById(id: number) {
    return await this.db.activity.findUnique({
      where: { id },
      include: {
        volunteer: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
        event: {
          include: {
            images: true,
          },
        },
      },
    });
  }

  async getUserByActivityId(id: number) {
    return await this.db.activity.findUnique({
      where: { id },
      select: {
        volunteer: {
          select: {
            id: true,
            fullname: true,
            email: true,
          },
        },
      },
    });
  }

  async updateActivityStatus(id: number, status: StatusActivity) {
    try {
      return await this.db.activity.update({
        where: { id },
        data: { status },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error400({
            message: `Activity with id ${id} not found.`,
          });
        }
      }
      throw error;
    }
  }

  async updateActivityPaymentStatus(id: number, statusPayment: StatusPayment) {
    try {
      return await this.db.activity.update({
        where: { id },
        data: { statusPayment },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error400({
            message: `Activity with id ${id} not found.`,
          });
        }
      }
      throw error;
    }
  }
}

export default ActivityRepository;
