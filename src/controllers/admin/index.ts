import type { Request, Response } from 'express';

// Get all users
const getAllUsers = (req: Request, res: Response) => res.send('Get all users');

// Get admin by ID
const getUsersById = (req: Request, res: Response) => {};

export default {
    getAllUsers,
    getUsersById,
};