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
    const { id } = req.params as any;

    const {
      title,
      description,
      additionalInfo,
      date,
      location,
      provinceId,
      regencyId,
      status,
      slotsNeeded,
      slotsAvailable,
      categoryEventId,
      newImages,
      delImages,
    } = req.body;

    const {
      services: { eventService },
    } = req.app;

    const result = await eventService.updatePutEvent(parseInt(id), {
      title,
      description,
      additionalInfo,
      date,
      location,
      provinceId,
      regencyId,
      status,
      slotsNeeded,
      slotsAvailable,
      categoryEventId,
      newImages,
      delImages,
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
 * /events/{id}:
 *   put:
 *     summary: Update event
 *     description: Status of event can be "open_registration" and "in_progress" and "completed" and "canceled"
 *     tags:
 *       - Events
 *     parameters:
 *       - in: header
 *         name: jwt
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Event id
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
 *               status:
 *                 type: string
 *               slotsNeeded:
 *                 type: number
 *               slotsAvailable:
 *                 type: number
 *               categoryEventId:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
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
const putEventRoute = router.put('/events/:id', handler as any);

export default putEventRoute;
