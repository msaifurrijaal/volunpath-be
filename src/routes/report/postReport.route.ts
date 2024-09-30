import { Router } from 'express';
import { BaseRequest, BaseResponse } from '../../types/common';
import ReportService from '../../services/report.service';
import errorHandler from '../../helpers/errorHandler';

const router = Router();

export const handler = async (
  req: BaseRequest<{ reportService: ReportService }>,
  res: BaseResponse,
) => {
  try {
    const { id } = req.headers.user as any;
    const { eventId, feedback } = req.body;

    const {
      services: { reportService },
    } = req.app;

    const result = await reportService.createReport({
      eventId,
      volunteerId: id,
      feedback,
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
 * /reports:
 *  post:
 *     summary: Create report
 *     tags:
 *       - Reports
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
 *               feedback:
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
const postReportRoute = router.post('/reports', handler as any);

export default postReportRoute;
