import { TokenExpiredError } from 'jsonwebtoken';
import config from '../config';
import { ResponseError } from '../errors/http.errors';

export default function errorHandler(error: any, res: any) {
  if (config.mode === 'dev') console.error(error);

  if (error.statusCode && error.message) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof ResponseError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof TokenExpiredError) {
    return res.status(401).json({ message: 'JWT token expired' });
  }

  res.status(500).json({
    message: errorMessage(error),
  });
}

const errorMessage = (error: any) => {
  if (config.mode === 'dev') return error?.toString();
  return 'Internal server error';
};
