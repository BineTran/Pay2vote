import { Request, Response, NextFunction } from 'express';
import * as UserAccountModel from '../models/userAccountModel';
import { User } from '../models/userAccountModel';
import { body } from 'express-validator';
import { hashPassword } from '../services/PasswordService';
import { validateRequest } from '../middlewares/requestValidator';

export const validateUser = [
	body('username').isString().notEmpty().withMessage('Username must not be empty'),
	body('password')
		.isString()
		.notEmpty()
		.withMessage('Password must not be empty')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters')
		.matches(/[a-z]/)
		.withMessage('Password must contain a lowercase letter'),
	body('name').isString().notEmpty().withMessage('Name must not be empty'),
	validateRequest,
];

export const createUserAccount = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Extract user info
		const { username, password, name } = req.body as Partial<User>;

		// Check for required fields
		if (!username || !password || !name) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		// Encrypt password
		const hashedPassword = await hashPassword(password);

		// Perform query
		await UserAccountModel.createUser({
			username,
			password: hashedPassword,
			name,
		});

		res.status(201).json({ message: 'User created successfully' });
	} catch (error: any) {
		next(error);
	}
};

export const getUserAccountByUserId = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user_id = parseInt(req.params.user_id, 10);
		const account = await UserAccountModel.getUserByUserId(user_id);
		if (!account) {
			return res.status(404).json({ message: 'Account not found' });
		}
		res.status(200).json(account);
	} catch (error: any) {
		next(error);
	}
};

export const getUserAccountByUsername = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const username = req.params.username;
		const account = await UserAccountModel.getUserByUsername(username);
		if (!account) {
			return res.status(404).json({ message: 'Account not found' });
		}
		res.status(200).json(account);
	} catch (error: any) {
		next(error);
	}
};

export const updateUserAccount = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Receive user and check for user id
		const user = req.body as Partial<User> & { id: number };

		// Check if user id is present
		if (!user.id) {
			const error = new Error('User id is required');
			return next(error);
		}

		// Check if any field is present
		if (Object.keys(user).length <= 1) {
			throw new Error('No field provided to update');
		}

		// Check that the provided fields are valid
		const validFields = ['id', 'password', 'name'];
		for (const field in user) {
			if (!validFields.includes(field)) {
				throw new Error(`Invalid field: ${field}`);
			}
		}

		// Call model to update it
		await UserAccountModel.updateUser(user);
		res.status(200).json({ message: 'User updated successfully' });
	} catch (error: any) {
		next(error);
	}
};

export const deleteUserAccount = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user_id = parseInt(req.params.user_id, 10);
		await UserAccountModel.deleteUser(user_id);
		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error: any) {
		next(error);
	}
};
