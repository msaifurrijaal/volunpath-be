import { Router } from 'express';
import { BaseRequest, BaseResponse } from '../../types/common';
import { AccountService } from '../../services/account.service';

const router = Router();

export const handler = async (
  req: BaseRequest<{ accountService: AccountService }>,
  res: BaseResponse,
) => {
  try {
    const { id } = req.headers.user as any;

    const {
      services: { accountService },
    } = req.app;

    const result = await accountService.getProfile(id);

    res.json({
      message: 'ok',
      data: result,
    });
  } catch (error: any) {
    res.json({
      message: error.message,
    });
  }
};

/**
 * @swagger
 * /account/profile:
 *   get:
 *     summary: Get profile
 *     description: Get profile
 *     tags:
 *       - Account
 *     parameters:
 *       - in: header
 *         name: jwt
 *         schema:
 *           type: string
 *         required: true
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
 */
const getProfileRouter = router.get('/account/profile', handler as any);

export default getProfileRouter;
