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
    const { id } = req.headers.user as any;

    const { eventId, motivation, additionalInfo } = req.body;
    const {
      services: { activityService },
    } = req.app;

    const result = await activityService.createActivity({
      volunteerId: id,
      eventId,
      motivation,
      additionalInfo,
    });

    res.json({
      message: 'ok',
      data: result,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * @swagger
 * /activities:
 *   post:
 *     summary: Create activity
 *     tags:
 *       - Activities
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
 *               eventId:
 *                 type: number
 *               motivation:
 *                 type: string
 *               additionalInfo:
 *                 type: string
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
const postActivityRoute = router.post('/activities', handler as any);

export default postActivityRoute;
