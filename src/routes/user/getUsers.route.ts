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
    const { search } = req.query;
    let { roleId, limit, offset } = req.query;

    roleId = roleId ? parseInt(roleId as string) : undefined;
    limit = limit ? parseInt(limit as string) : undefined;
    offset = offset ? parseInt(offset as string) : undefined;

    const {
      services: { userService },
    } = req.app;
    const result = await userService.getUsers({
      roleId: roleId,
      limit: limit,
      offset: offset,
      search: search,
    });
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
 * /users:
 *   get:
 *     summary: Get users
 *     description: Get users
 *     tags:
 *       - Users
 *     parameters:
 *       - in: header
 *         name: jwt
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: roleId
 *         schema:
 *           type: number
 *         required: true
 *         description: Role id
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search
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
const getUsersRouter = router.get('/users', handler as any);

export default getUsersRouter;
