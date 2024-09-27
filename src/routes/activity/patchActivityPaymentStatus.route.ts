import { Router } from 'express';
import { BaseRequest, BaseResponse } from '../../types/common';
import ActivityService from '../../services/activity.service';
import errorHandler from '../../helpers/errorHandler';

const router = Router();

const handler = async (
  req: BaseRequest<{ activityService: ActivityService }>,
  res: BaseResponse,
) => {
  try {
    const { id } = req.params as any;
    const { status } = req.body;
    const {
      services: { activityService },
    } = req.app;

    const result = await activityService.updateActivityPaymentStatus(parseInt(id), status);

    res.json({
      message: 'Activity status updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error in update activity status handler:', error);
    errorHandler(error, res);
  }
};

/**
 * @swagger
 * /activities/{id}/payment-status:
 *   patch:
 *     summary: Update activity status
 *     description: Status of activity can be "pending" and "approved" and "canceled"
 *     tags:
 *       - Activities
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
 *         description: Activity id
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
const patchActivityPaymentStatusRoute = router.patch(
  '/activities/:id/payment-status',
  handler as any,
);

export default patchActivityPaymentStatusRoute;
