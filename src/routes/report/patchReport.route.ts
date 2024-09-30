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
    const { id } = req.params as any;
    const { feedback } = req.body;

    const {
      services: { reportService },
    } = req.app;

    const result = await reportService.updatePatchReport(parseInt(id), feedback);
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
 * /reports/{id}:
 *  patch:
 *    summary: Update report
 *    descriptions: Update report
 *    tags:
 *      - Reports
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
 *        description: Report id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              feedback:
 *                type: string
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
const patchReportRoute = router.patch('/reports/:id', handler as any);

export default patchReportRoute;
