import { Router } from 'express';
import { BaseRequest, BaseResponse } from '../../types/common';
import AuthService from '../../services/auth.service';
import errorHandler from '../../helpers/errorHandler';

const router = Router();

export const handler = async (
  req: BaseRequest<{ authService: AuthService }>,
  res: BaseResponse,
) => {
  try {
    const {
      username,
      email,
      password,
      fullname,
      phone,
      organizationDetail: {
        name,
        address,
        provinceId,
        regencyId,
        description,
        categoryOrganizationId,
      },
    } = req.body;

    const {
      services: { authService },
    } = req.app;

    const result = await authService.registerOrganizationUser({
      username,
      email,
      password,
      fullname,
      phone,
      organizationDetail: {
        name,
        address,
        provinceId,
        regencyId,
        description,
        categoryOrganizationId,
      },
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
 * /auth/register/organization:
 *   post:
 *     summary: Register volunteer organization
 *     description: Register volunteer organization
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullname:
 *                 type: string
 *               phone:
 *                 type: string
 *               organizationDetail:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   address:
 *                     type: string
 *                   provinceId:
 *                     type: number
 *                   regencyId:
 *                     type: number
 *                   description:
 *                     type: string
 *                   categoryOrganizationId:
 *                     type: number
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
const registerOrganizationUserRoute = router.post('/auth/register/organization', handler as any);

export default registerOrganizationUserRoute;
