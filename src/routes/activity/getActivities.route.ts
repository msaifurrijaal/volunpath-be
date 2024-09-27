import { Router } from 'express';
import { BaseRequest, BaseResponse } from '../../types/common';
import ActivityService from '../../services/activity.service';
import errorHandler from '../../helpers/errorHandler';

const router = Router();

export const handler = async (
  req: BaseRequest<{ activityService: ActivityService }>,
  res: BaseResponse,
) => {
  try {
    const { search, status, statusPayment } = req.query;
    let { volunteerId, eventId, limit, offset } = req.query;

    volunteerId = volunteerId ? parseInt(volunteerId as string) : undefined;
    eventId = eventId ? parseInt(eventId as string) : undefined;
    limit = limit ? parseInt(limit as string) : undefined;
    offset = offset ? parseInt(offset as string) : undefined;

    const {
      services: { activityService },
    } = req.app;

    const result = await activityService.getActivities({
      volunteerId,
      eventId,
      status,
      statusPayment,
      limit,
      offset,
      search,
    });

    res.json({
      message: 'ok',
      data: result,
    });
  } catch (error: any) {
    errorHandler(error, res);
  }
};

/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Get activities
 *     description: Get activities for volunteers and events
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: header
 *         name: jwt
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: volunteerId
 *         schema:
 *           type: number
 *         description: ID of the volunteer
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: number
 *         description: ID of the event
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Status of the activity (e.g. pending, approved, rejected, cancelled, quotaFull)
 *       - in: query
 *         name: statusPayment
 *         schema:
 *           type: string
 *         description: Status of the payment (e.g. pending, approved, cancelled)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of records to fetch
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *         description: Number of records to skip
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search string (can search by volunteer name or event title)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: object
 *                   properties:
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const getActivitiesRoute = router.get('/activities', handler as any);

export default getActivitiesRoute;
