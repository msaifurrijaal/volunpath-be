import type { NextFunction, Request, Response } from 'express';
import { IGNORED_JWT_PATH, IGNORED_JWT_PATH_START_WITH } from '../constant/IGNORED_PATH';
import throwIfMissing from '../helpers/throwIfMissing';
import errorHandler from '../helpers/errorHandler';
import { jwtVerify } from '../helpers/jwt';

const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(IGNORED_JWT_PATH.includes(req.path)) {
        next();
        return
    }

    for(const path in IGNORED_JWT_PATH_START_WITH) {
        if(req.path.startsWith(path)) {
            next();
            return
        }
    }

     try {
       const jwt = req.headers.jwt;

       throwIfMissing(jwt, 'jwt is required', 400);
       const decodedJwt = jwtVerify(jwt as string);
       req.headers.user = decodedJwt as any;
       next();
     } catch (error) {
       errorHandler(error, res);
     }
}

export default jwtMiddleware;