import { Router } from 'express';

import errorHandler from '../../helpers/errorHandler';
import { BaseRequest, BaseResponse } from '../../types/common';

const router = Router();

export const handler = async (req: BaseRequest, res: BaseResponse) => {
  try {
    const { refreshToken } = req.body;
    const {
      services: { authService },
    } = req.app;

    const result = await authService.refreshToken(refreshToken);

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
 * /auth/refresh-token:
 *   post:
 *     summary: User refresh token
 *     description: Retreive JWT token for user refresh token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         description: Refresh token successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const postRefreshTokenRouter = router.post('/auth/refresh-token', handler as any);

export default postRefreshTokenRouter;
