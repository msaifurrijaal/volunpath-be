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
      volunteerDetail: { educationId, otherDetails, address, provinceId, regencyId },
      skillIds,
    } = req.body;

    const {
      services: { authService },
    } = req.app;

    const result = await authService.registerVolunteerUser({
      username,
      email,
      password,
      fullname,
      phone,
      volunteerDetail: {
        educationId,
        otherDetails,
        address,
        provinceId,
        regencyId,
      },
      skillIds,
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
 * /auth/register/volunteer:
 *   post:
 *     summary: Register volunteer user
 *     description: Register volunteer user
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
 *               volunteerDetail:
 *                 type: object
 *                 properties:
 *                   educationId:
 *                     type: number
 *                   otherDetails:
 *                     type: string
 *                   address:
 *                     type: string
 *                   provinceId:
 *                     type: number
 *                   regencyId:
 *                     type: number
 *               skillIds:
 *                 type: array
 *                 items:
 *                   type: number
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
const registerVolunteerUserRoute = router.post('/auth/register/volunteer', handler as any);

export default registerVolunteerUserRoute;
