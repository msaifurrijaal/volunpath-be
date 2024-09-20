import { Router } from 'express';

import errorHandler from '../../helpers/errorHandler';
import { BaseRequest, BaseResponse } from '../../types/common';
import AuthService from '../../services/auth.service';

const router = Router();

export const handler = async (
  req: BaseRequest<{ authService: AuthService }>,
  res: BaseResponse,
) => {
  try {
    const { email, password } = req.body;

    const {
      services: { authService },
    } = req.app;

    const result = await authService.login(email, password);

    res.json({
      message: 'ok',
      data: result,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const postLoginRouter = router.post('/auth/login', handler as any);

export default postLoginRouter;
