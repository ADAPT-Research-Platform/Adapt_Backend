import type { Request, Response, NextFunction } from 'express';
import type { HttpError as IHttpError } from 'http-errors';
import createHttpError, { isHttpError } from 'http-errors';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: IHttpError;

  if (isHttpError(err)) {
    error = err;
  } else if (err instanceof Error) {
    console.error('Internal server error:', err.stack);
    error = createHttpError(500, err.message ?? 'Unexpected error');
  } else {
    console.error('Unhandled error:', err);
    error = createHttpError(500, 'An unexpected error occurred');
  }

  const formattedError = {
    message: error.message,
    name: error.name,
    status: error.status,
  };

  res.status(error.status || 500).json(formattedError);
};
