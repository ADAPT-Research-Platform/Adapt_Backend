import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import jwt from 'jsonwebtoken';

import {
  generateVerificationToken,
  sendVerificationEmail,
} from '../../utils/utils';

import { UserType } from '../../enums/enum';

import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';
import type { UsersCreateBody, UsersDeleteBody, UsersUpdateBody } from '../../types/routes/users';
import { validateCreateBody } from './validators';
import logger from '../../logger';

export const getUserId = (req: Request): number => {
  if (!req.user || !req.user.id) {
    throw createHttpError(401, 'User not authenticated');
  }
  return req.user.id;
};

const create = async (
  req: TypedRequestBody<UsersCreateBody>,
  res: Response
) => {
  const { username, email, password } = validateCreateBody(req.body);

  // Create a query runner
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    // Connect and start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userRepo = queryRunner.manager.getRepository(User);

    // Check if username already exists
    const usernameExists = await userRepo.findOne({ where: { username } });
    if (usernameExists) {
      throw createHttpError(409, 'Username already exists!');
    }

    // Check if email already exists
    const emailExists = await userRepo.findOne({ where: { email } });
    if (emailExists) {
      throw createHttpError(409, 'Email already exists!');
    }

    // Create and save the new user
    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.role = UserType.CLIENT;
    newUser.isVerified = false; // Add `isVerified` field to track email verification
    newUser.setPassword(password);
    await queryRunner.manager.save(newUser);

    // Generate verification token
    const verificationToken = generateVerificationToken(newUser.id.toString());

    // Send the verification email
    await sendVerificationEmail(email, verificationToken);

    // Commit the transaction
    await queryRunner.commitTransaction();

    return res.sendStatus(201);
  } catch (err) {
    // Rollback the transaction on error
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    // Log and handle the error
    logger.error('Error creating user:', err);

    // Handle known error types
    if (err instanceof createHttpError.HttpError) {
      throw err;
    } else {
      throw createHttpError(500, 'Internal Server Error!');
    }
  } finally {
    // Release the query runner
    await queryRunner.release();
  }
};

const update = async (
  req: TypedRequestBody<UsersUpdateBody>,
  res: Response
) => {
  const userId = getUserId(req);
  const { userName, currentPassword, newPassword } = req.body;

  // Create a query runner
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    // Connect and start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userRepo = queryRunner.manager.getRepository(User);

    // Fetch the user by id
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    // Check if username already exists
    if (user.username !== userName) {
      const usernameExists = await userRepo.findOne({ where: { username: userName } });
      if (usernameExists) {
        throw createHttpError(409, 'Username already exists!');
      }
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        throw createHttpError(400, 'Current password not provided!');
      }

      // Verify the current password
      if (!user.verifyPassword(currentPassword)) {
        throw createHttpError(403, 'Current password is incorrect!');
      }

      // Update username if provided
      if(userName){
        user.username = userName;
      }
      user.setPassword(newPassword); // Update password
    }else{
      // Update username if provided
      if(userName){
        user.username = userName;
      }
    }

    user.updatedAt = new Date();
    await queryRunner.manager.save(user);

    // Commit the transaction
    await queryRunner.commitTransaction();

    return res.sendStatus(200);
  } catch (err) {
    // Rollback the transaction on error
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    // Log and handle the error
    logger.error('Error updating user:', err);
    
    // Handle known error types
    if (err instanceof createHttpError.HttpError) {
      throw err;
    } else {
      throw createHttpError(500, 'Internal Server Error!');
    }
  } finally {
    // Release the query runner
    await queryRunner.release();
  }
};

const disable = async (
  req: TypedRequestBody<UsersDeleteBody>,
  res: Response,
  next: NextFunction
) => {

  const userId = getUserId(req);
  const { currentPassword } = req.body;

  if (!currentPassword) {
    logger.warn('Password not provided!');
    throw createHttpError(400, 'Password not provided!');
  }

  // Create a query runner
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    // Connect and start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userRepo = queryRunner.manager.getRepository(User);

    // Fetch the user by id
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    // Verify the current password
    if (!user.verifyPassword(currentPassword)) {
      throw createHttpError(403, 'Password is incorrect!');
    }

    if (!user.isActive) {
      throw createHttpError(400, 'User is already deleted!');
    }

    // Soft delete the user (mark as deleted)
    user.deletedAt = new Date();
    user.isActive = false; // Optionally deactivate the user account
    await queryRunner.manager.save(user);

    // Commit the transaction
    await queryRunner.commitTransaction();

    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy(() => res.sendStatus(200));
    });
  } catch (err) {
    // Rollback the transaction on error
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    // Log and handle the error
    logger.error('Error deleting user:', err);

    // Handle known error types
    if (err instanceof createHttpError.HttpError) {
      throw err;
    } else {
      throw createHttpError(500, 'Internal Server Error!');
    }
  } finally {
    // Release the query runner
    await queryRunner.release();
  }
};

const verifyEmail = async (
  req: Request,
  res: Response
) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    throw createHttpError(400, 'Invalid or missing token!');
  }

  // Create a query runner
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    // Connect and start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userRepo = queryRunner.manager.getRepository(User);

    // Decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    const userId = (decoded as { id: string }).id;

    // Find the user by ID
    const user = await userRepo.findOne({ where: { id: Number(userId) } });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    if (user.isVerified) {
      throw createHttpError(400, 'Email already verified!');
    }

    // Mark the user as verified
    user.isVerified = true;
    await queryRunner.manager.save(user);

    // Commit the transaction
    await queryRunner.commitTransaction();

    // Send success response
    return res.sendStatus(200);
  } catch (err) {
    // Rollback the transaction on error
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    // Log and handle the error
    logger.error('Error verifying email:', err);

    // Handle known error types
    if (err instanceof createHttpError.HttpError) {
      throw err;
    } else {
      throw createHttpError(500, 'Internal Server Error!');
    }
  } finally {
    // Release the query runner
    await queryRunner.release();
  }
};

export default {
  create,
  update,
  disable,
  verifyEmail,
};
