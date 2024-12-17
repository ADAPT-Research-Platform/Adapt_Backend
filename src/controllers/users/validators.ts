import createHttpError from 'http-errors';
import isEmail from 'validator/lib/isEmail';

import type { UsersCreateBody } from '../../types/routes/users';
import type { MoodCreateBody } from '../../types/routes/mood';

export const validateCreateBody = (body: Partial<UsersCreateBody>) => {
    const { username, email, password } = body;

    if (!username) {
        throw createHttpError(400, 'Username required');
    }
    if (username.length < 5) {
        throw createHttpError(400, 'Username must contain at least 5 characters');
    }

    if (!email) {
        throw createHttpError(400, 'Email required');
    }
    if (!isEmail(email)) {
        throw createHttpError(400, 'Email is invalid');
    }

    if (!password) {
        throw createHttpError(400, 'Password required');
    }
    if (password.length < 8) {
        throw createHttpError(400, 'Password must contain at least 8 characters');
    }

    // As the function checked the properties are not missing,
    // return the body as original type
    return body as UsersCreateBody;
};

export const validateMoodCreateBody = (body: Partial<MoodCreateBody>) => {
    const { userId, feeling, motivation, date } = body;

    if (!userId || typeof userId !== 'string') {
        throw createHttpError(400, 'Invalid or missing userId');
    }
    if (!feeling || feeling < 1 || feeling > 5) {
        throw createHttpError(400, 'Feeling must be between 1 and 5');
    }
    if (!motivation || motivation < 1 || motivation > 5) {
        throw createHttpError(400, 'Motivation must be between 1 and 5');
    }
    if (!date || isNaN(Date.parse(date))) {
        throw createHttpError(400, 'Invalid date format');
    }

    return { userId, feeling, motivation, date };
};
