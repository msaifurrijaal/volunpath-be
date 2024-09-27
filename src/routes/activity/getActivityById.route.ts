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
    const { id } = req.params as any;

    const {
      services: { activityService },
    } = req.app;

    const result = await activityService.getActivityById(parseInt(id));
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
 * /activities/{id}:
 *  get:
 *    summary: Get activity by id
 *    description: Get activity by id
 *    tags:
 *      - Activities
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
 *        description: Activity id
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
const getActivityByIdRoute = router.get('/activities/:id', handler as any);

export default getActivityByIdRoute;
