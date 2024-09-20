import { Router, Request, Response } from 'express';

const router = Router();

export const handler = async (req: Request, res: Response) => {
  res.json({
    message: 'Hello World!',
  });
};

const testRoute = router.get('/', handler);

export default testRoute;
