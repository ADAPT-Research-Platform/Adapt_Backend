import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

import logger from '../utils/logger';

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
    logger.info(`isAdmin middleware called ${req.body}`);
    logger.info(`isAdmin: req.user: ${JSON.stringify(req.user)}`);
    if (!req.isAuthenticated()) {
        return next(createHttpError(403, 'User is not authenticated.'));
    }
    if (!req.user) {
        return next(createHttpError(403, 'User object is not available on the request.'));
    }
    if (req.user.role !== UserType.ADMIN) {
        return next(createHttpError(403, `User role is "${req.user.role}", but expected "admin".`));
    }
    next();
};