import type { NextFunction, Request, Response } from 'express';
import type { HttpError } from 'http-errors';
import createHttpError from 'http-errors';
import passport from 'passport';

import type { AuthLoginBody, AuthLoginResponse } from '../../types/routes/auth';
import type { User } from '../../entities/user';
import { validateLoginBody } from './validators';

const login = (
    req: TypedRequestBody<AuthLoginBody>,
    res: Response<AuthLoginResponse>,
    next: NextFunction,
) => {
    validateLoginBody(req.body);

    passport.authenticate(
        'local',
        (err: HttpError | null, user: User | undefined) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return next(
                    createHttpError(401, 'Incorrect credentials!'),
                );
            }

            // Check if the user is verified and active
            if (!user.isVerified) {
                return next(
                    createHttpError(403, 'Email not verified!'),
                );
            }

            if (!user.isActive) {
                return next(
                    createHttpError(403, 'User not available!'),
                );
            }

            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }

                return res.send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    isActive: user.isActive
                });
            });
        },
    )(req, res, next);
};

const logout = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(() => res.sendStatus(200));
    });
};

const get = (
    req: Request,
    res: Response<AuthLoginResponse>,
    next: NextFunction,
) => {
    if (req.isAuthenticated()) {

        return res.send({
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            isActive: req.user.isActive,
        });
    } else {
        return next(
            createHttpError(401, 'Unauthorized'),
        );
    }
};

const authenticated = (
    req: Request,
    res: Response,
) => {
    if (req.isAuthenticated()) {
        res.send('You are authenticated');
    } else {
        res.send('You are not authenticated');
    }
};

const verifyCookie = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    // Extract and decode the cookie
    const rawCookie = req.headers.cookie;

    if (!rawCookie) {
        return next(createHttpError(401, 'Unauthorized: No cookie provided'));
    }

    const sessionCookie = rawCookie.split('; ').find((c) => c.startsWith('s%3A'));

    if (!sessionCookie) {
        return next(createHttpError(401, 'Unauthorized: Invalid cookie'));
    }

    const decodedCookie = decodeURIComponent(sessionCookie);

    const sessionId = decodedCookie.split('s:')[1]?.split('.')[0];

    if (!sessionId) {
        return next(createHttpError(401, 'Unauthorized: Malformed cookie'));
    }

    req.sessionStore.get(sessionId, (err, session) => {
        if (err) {
            console.error('Session retrieval error:', err);
            return next(createHttpError(500, 'Internal Server Error'));
        }

        if (!session) {
            return next(createHttpError(401, 'Unauthorized: Invalid session'));
        }

        res.status(200).send('Cookie is valid');
    });
};

export default {
    login,
    logout,
    get,
    authenticated,
    verifyCookie,
};