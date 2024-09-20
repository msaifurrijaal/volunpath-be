import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import getMiddleWares from './middlewares';
import getRoutes from './routes';
import createService from './services';

export const setupServer = async () => {
  const app: any = express();

  /** Middleware initialization */
  app.use(cors());
  app.use(express.json({ limit: '5mb' }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

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
}