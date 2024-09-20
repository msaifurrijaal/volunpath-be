import type { NextFunction, Request, Response } from 'express';

const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
    next();
}

export default jwtMiddleware;