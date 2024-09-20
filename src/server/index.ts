import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import getMiddleWares from './middlewares';
import getRoutes from './routes';
import createService from './services';
import generateSwagger from './swagger';
import expressBasicAuth from 'express-basic-auth';

export const setupServer = async () => {
  const app: any = express();

  /** Middleware initialization */
  app.use(cors());
  app.use(express.json({ limit: '5mb' }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  const { serve, setup } = generateSwagger();
  app.use(
    '/docs',
    expressBasicAuth({ users: { admin: 'admin@12345' }, challenge: true }),
    serve,
    setup,
  );

  /** middleware */
  app.use(await getMiddleWares());

  /**routes */
  app.use(await getRoutes());

  /** services */
  app.services = await createService();

  app.use('*', (req: Request, res: Response) => {
    res.status(404).json('404 Page Not Found');
  });

  return app;
};
