import { Router } from 'express';
import { BaseRequest, BaseResponse } from '../../types/common';
import UserService from '../../services/user.service';
import errorHandler from '../../helpers/errorHandler';

const router = Router();

export const handler = async (
  req: BaseRequest<{ userService: UserService }>,
  res: BaseResponse,
) => {
  try {
    const { id } = req.params as any;
    const {
      services: { userService },
    } = req.app;

    const result = await userService.getUserById(parseInt(id));
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
 * /users/{id}:
 *  get:
 *     summary: Get user by id
 *     description: Get user by id
 *     tags:
 *       - Users
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
 *         description: user id
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
const getUserByIdRouter = router.get('/users/:id', handler as any);

export default getUserByIdRouter;
