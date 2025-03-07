import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

import { UserType } from '../enums/enum';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        req.userId = req.user.id; // Attach user ID directly
        next();
    } else {
        next(createHttpError(403, 'User must be authenticated'));
    }
};

export const isUnauthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isUnauthenticated()) {
        next();
    } else {
        next(createHttpError(403, 'User must not be authenticated'));
    }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user.role === UserType.ADMIN) {
        next();
    } else {
        next(createHttpError(403, 'User must be an admin'));
    }
};