import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import jwt from 'jsonwebtoken';

import {
  generateVerificationToken,
  sendVerificationEmail,
} from '../../utils/utils';

import { UserType } from '../../enums/enum';

import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';
import type { UsersCreateBody } from '../../types/routes/users';
import { validateCreateBody } from './validators';

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
      throw createHttpError(409, 'Username already exists');
    }

    // Check if email already exists
    const emailExists = await userRepo.findOne({ where: { email } });
    if (emailExists) {
      throw createHttpError(409, 'Email already exists');
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

    res.status(201).send({
      id: newUser.id,
      message: 'User created. Please verify your email.',
    });
  } catch (err) {
    // Rollback the transaction on error
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    // Log and handle the error
    console.error('Error creating user:', err);
    // Handle known error types
    if (err instanceof createHttpError.HttpError) {
      res.status(err.status).send(err.message);
    } else if (err instanceof Error) {
      res.status(500).send(err.message || 'Internal Server Error');
    } else {
      res.status(500).send('An unknown error occurred');
    }
  } finally {
    // Release the query runner
    await queryRunner.release();
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).send('Invalid or missing token.');
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
      throw createHttpError(404, 'User not found.');
    }

    if (user.isVerified) {
      throw createHttpError(400, 'Email already verified.');
    }

    // Mark the user as verified
    user.isVerified = true;
    await queryRunner.manager.save(user);

    // Commit the transaction
    await queryRunner.commitTransaction();

    // Send success response
    res.status(200).send('Email verified successfully!');
  } catch (err) {
    // Rollback the transaction on error
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    // Handle known error types
    if (err instanceof createHttpError.HttpError) {
      res.status(err.status).send(err.message);
    } else if (err instanceof Error) {
      res.status(400).send(err.message || 'Invalid or expired token.');
    } else {
      res.status(500).send('An unknown error occurred.');
    }
  } finally {
    // Release the query runner
    await queryRunner.release();
  }
};

export default {
  create,
  verifyEmail,
};
