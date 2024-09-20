import { Router } from 'express';
import { BaseRequest, BaseResponse } from '../../types/common';
import { EducationService } from '../../services/education.service';
import errorHandler from '../../helpers/errorHandler';

const router = Router();

export const handler = async (
  req: BaseRequest<{ educationService: EducationService }>,
  res: BaseResponse,
) => {
  try {
    const {
      services: { educationService },
    } = req.app;

    const result = await educationService.getEducations();
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
 * /educations:
 *   get:
 *     summary: Get educations
 *     description: Get educations
 *     tags:
 *       - Educations
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
 *                   type: array
 *                   items:
 *                     type: object
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
const getEducationsRouter = router.get('/educations', handler as any);

export default getEducationsRouter;
