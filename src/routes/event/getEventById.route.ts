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
      services: { eventService },
    } = req.app;

    const result = await eventService.getEventById(parseInt(id));
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
 *  get:
 *    summary: Get event by id
 *    description: Get event by id
 *    tags:
 *      - Events
 *    parameters:
 *      - in: header
 *        name: jwt
 *        schema:
 *          type: string
 *        required: true
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: Event id
 *    responses:
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
 */
const getEventByIdRoute = router.get('/events/:id', handler as any);

export default getEventByIdRoute;
