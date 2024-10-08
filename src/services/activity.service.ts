import { z } from 'zod';
import { ActivityRepository } from '../repositories/activity.repository';
import { CreateActivityReq } from '../types/apps/activity.type';
import { Error400 } from '../errors/http.errors';
import { StatusActivity, StatusPayment } from '@prisma/client';
import transporter from '../config/mailer';
import { ConfigProps } from '../config';

export class ActivityService {
  name = 'activityService';
  activityRepository: ActivityRepository;
  config: ConfigProps;

  constructor(ctx: {
    repositories: { activityRepository: ActivityRepository };
    config: ConfigProps;
  }) {
    this.activityRepository = ctx.repositories.activityRepository;
    this.config = ctx.config;
  }

  async createActivity(data: CreateActivityReq) {
    const schema = z.object({
      volunteerId: z.number({ required_error: 'Volunteer ID is required' }),
      eventId: z.number({ required_error: 'Event ID is required' }),
      motivation: z.string({ required_error: 'Motivation is required' }),
      additionalInfo: z.string().optional(),
    });

    const parsedData = schema.safeParse(data);
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    return this.activityRepository.createActivity(data);
  }

  async getActivityById(id: number) {
    const schema = z.object({
      id: z.number({ required_error: 'Activity ID is required' }),
    });

    const parsedData = schema.safeParse({ id });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    const activity = await this.activityRepository.getActivityById(id);
    if (!activity) {
      throw new Error400({ message: 'Activity not found' });
    }

    return activity;
  }

  async getActivities({
    volunteerId,
    eventId,
    status,
    statusPayment,
    limit,
    offset,
    search,
  }: {
    volunteerId?: number;
    eventId?: number;
    status?: StatusActivity;
    statusPayment?: StatusPayment;
    limit?: number;
    offset?: number;
    search?: string;
  }) {
    const schema = z.object({
      volunteerId: z.number().optional(),
      eventId: z.number().optional(),
      status: z.nativeEnum(StatusActivity).optional(),
      statusPayment: z.nativeEnum(StatusPayment).optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
      search: z.string().optional(),
    });

    const parsedData = schema.safeParse({
      volunteerId,
      eventId,
      status,
      statusPayment,
      limit,
      offset,
      search,
    });

    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    return this.activityRepository.getActivities({
      volunteerId,
      eventId,
      status,
      statusPayment,
      limit,
      offset,
      search,
    });
  }

  async updateActivityStatus(id: number, status: StatusActivity) {
    const schema = z.object({
      status: z.enum([
        StatusActivity.pending,
        StatusActivity.approved,
        StatusActivity.rejected,
        StatusActivity.cancelled,
        StatusActivity.quotaFull,
      ]),
    });

    const parsedData = schema.safeParse({ status });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    const updatedActivityStatus = await this.activityRepository.updateActivityStatus(
      id,
      parsedData.data.status,
    );

    const data = await this.activityRepository.getUserByActivityId(id);

    const mailOptions = {
      from: this.config.smtpEmail,
      to: data?.volunteer.email,
      subject: 'Activity Status Updated',
      text: `Hallo ${data?.volunteer.fullname},\n\nThe status of activity ID ${id} has been updated to ${parsedData.data.status}.\n\nThank you for using our platform.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }

    return updatedActivityStatus;
  }

  async updateActivityPaymentStatus(id: number, statusPayment: StatusPayment) {
    const schema = z.object({
      statusPayment: z.enum([
        StatusPayment.pending,
        StatusPayment.approved,
        StatusPayment.cancelled,
      ]),
    });

    const parsedData = schema.safeParse({ statusPayment });
    if (!parsedData.success) {
      const errorMessage = parsedData.error.issues[0].message;
      throw new Error400({ message: errorMessage });
    }

    const updatedActivityPaymentStatus = await this.activityRepository.updateActivityPaymentStatus(
      id,
      parsedData.data.statusPayment,
    );

    const data = await this.activityRepository.getUserByActivityId(id);

    const mailOptions = {
      from: this.config.smtpEmail,
      to: data?.volunteer.email,
      subject: 'Activity Payment Status Updated',
      text: `Hallo ${data?.volunteer.fullname},\n\nThe status of activity payment ID ${id} has been updated to ${parsedData.data.statusPayment}.\n\nThank you for using our platform.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }

    return updatedActivityPaymentStatus;
  }
}

export default ActivityService;
