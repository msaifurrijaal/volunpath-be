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
    let { eventId, limit, offset } = req.query;

    eventId = eventId ? parseInt(eventId as string) : undefined;
    limit = limit ? parseInt(limit as string) : undefined;
    offset = offset ? parseInt(offset as string) : undefined;

    const {
      services: { reportService },
    } = req.app;

    const result = await reportService.getReports({
      eventId,
      limit,
      offset,
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
 *  get:
 *     summary: Get reports
 *     description: Get reports
 *     tags:
 *       - Reports
 *     parameters:
 *       - in: header
 *         name: jwt
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: number
 *         required: true
 *         description: eventId
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
const getReportsRoute = router.get('/reports', handler as any);

export default getReportsRoute;
