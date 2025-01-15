import type { Request, Response } from 'express';

import type { UsersGetResponse } from 'src/types/routes/users';

import { UserType } from '../../enums/enum';

import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';

// Get all users
const getAllUsers = (req: Request, res: Response) => {
  const userRepo = AppDataSource.getRepository(User);

  // Get all users with role 'user', isActive = true, and isVerified = true
  userRepo
    .find({
      where: { role: UserType.CLIENT, isActive: true, isVerified: true },
    })
    .then((users) => {
      // Map the database entities to the UsersGetResponse interface
      const userResponses: UsersGetResponse[] = users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isActive: user.isActive,
      }));

      res.status(200).json(userResponses);
    })
    .catch((err) => {
      console.error('Database error:', err); // Log the error for debugging
      res.status(500).json({ message: 'Internal server error' });
    });
};

// Get admin by ID
const getUsersById = (req: Request, res: Response) => {
  const userRepo = AppDataSource.getRepository(User);
  const { id } = req.params;

  const userId = parseInt(id, 10);
  if (isNaN(userId) || userId < 1) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  userRepo
    .findOneBy({ id: userId })
    .then((user) => {
      if (user) {
        // Map the database entity to the UsersGetResponse interface
        const userResponse: UsersGetResponse = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          isActive: user.isActive,
        };

        res.status(200).json(userResponse);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch((err) => {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
};

export default {
  getAllUsers,
  getUsersById,
};
