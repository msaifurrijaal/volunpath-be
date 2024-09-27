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
    const { status } = req.body;

    const {
      services: { eventService },
    } = req.app;

    const result = await eventService.updateEventStatus(parseInt(id), status);

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
 * /events/{id}/status:
 *   patch:
 *     summary: Update event status
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
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
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
const patchEventStatusRoute = router.patch('/events/:id/status', handler as any);

export default patchEventStatusRoute;
