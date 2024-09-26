import { Router } from 'express';
import { BaseRequest, BaseResponse } from '../../types/common';
import EventService from '../../services/event.service';
import errorHandler from '../../helpers/errorHandler';

const router = Router();

export const handler = async (
  req: BaseRequest<{ eventService: EventService }>,
  res: BaseResponse,
) => {
  try {
    const { search, status } = req.query;
    let { organizerId, categoryEventId, limit, offset } = req.query;

    organizerId = organizerId ? parseInt(organizerId as string) : undefined;
    categoryEventId = categoryEventId ? parseInt(categoryEventId as string) : undefined;
    limit = limit ? parseInt(limit as string) : undefined;
    offset = offset ? parseInt(offset as string) : undefined;

    const {
      services: { eventService },
    } = req.app;

    const result = await eventService.getEvents({
      organizerId,
      categoryEventId,
      status,
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
 * /events:
 *   get:
 *     summary: Get events
 *     description: Get events
 *     tags:
 *       - Events
 *     parameters:
 *       - in: header
 *         name: jwt
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: organizerId
 *         schema:
 *           type: number
 *         description: organizerId
 *       - in: query
 *         name: categoryEventId
 *         schema:
 *           type: number
 *         description: categoryEventId
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: status example -> [open_registration, in_progress, completed, cancelled]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: limit
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *         description: offset
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search
 *     responses:
 *       200:
 *         description: ok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: Object
 *                   properties:
 *                     users:
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
const getEventsRoute = router.get('/events', handler as any);

export default getEventsRoute;
