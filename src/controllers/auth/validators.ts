import createHttpError from 'http-errors';

import type { AuthLoginBody } from '../../types/routes/auth';

export const validateLoginBody = (body: Partial<AuthLoginBody>) => {
    const { username, password } = body;

    if (!username) {
        throw createHttpError(400, 'Username or Email not provided!');
    }

    if (!password) {
        throw createHttpError(400, 'Password not provided!');
    }

    // As the function checked the properties are not missing,
    // return the body as original type
    return body as AuthLoginBody;
};