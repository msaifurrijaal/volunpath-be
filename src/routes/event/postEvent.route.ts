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
    const { id } = req.headers.user as any;

    const {
      title,
      description,
      additionalInfo,
      date,
      location,
      provinceId,
      regencyId,
      slotsNeeded,
      categoryEventId,
      images,
    } = req.body;

    const {
      services: { eventService },
    } = req.app;

    const result = await eventService.createEvent({
      organizerId: id,
      title,
      description,
      additionalInfo,
      date,
      location,
      provinceId,
      regencyId,
      slotsNeeded,
      categoryEventId,
      images,
    });

    res.status(201).json({
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
 *   post:
 *     summary: Create event
 *     description: Create event
 *     tags:
 *       - Events
 *     parameters:
 *       - in: header
 *         name: jwt
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               additionalInfo:
 *                 type: string
 *               date:
 *                 type: string
 *               location:
 *                 type: string
 *               provinceId:
 *                 type: number
 *               regencyId:
 *                 type: number
 *               slotsNeeded:
 *                 type: number
 *               categoryEventId:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
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
 *                   type: object
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
const postEventRoute = router.post('/events', handler as any);

export default postEventRoute;
