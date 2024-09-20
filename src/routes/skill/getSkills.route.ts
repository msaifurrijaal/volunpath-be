import { Router } from 'express';
import SkillService from '../../services/skill.service';
import { BaseRequest, BaseResponse } from '../../types/common';
import errorHandler from '../../helpers/errorHandler';

const router = Router();

export const handler = async (
  req: BaseRequest<{ skillService: SkillService }>,
  res: BaseResponse,
) => {
  try {
    const {
      services: { skillService },
    } = req.app;

    const result = await skillService.getSkills();
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
 * /skills:
 *   get:
 *     summary: Get skills
 *     description: Get skills
 *     tags:
 *       - Skills
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
const getSkillRoute = router.get('/skills', handler as any);

export default getSkillRoute;
