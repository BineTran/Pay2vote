import { body } from 'express-validator';
import { validateRequest } from '../middlewares/requestValidator';
import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/AuthService';
import config from '../../config';
import { logger } from '@/utils/logger';
const jwt = require('jsonwebtoken');

// Validate signup route, then perform signup
export const validateSignup = [
	body('username').isString().notEmpty().withMessage('Username is required'),
	body('password').isString().notEmpty().withMessage('Username is required'),
	body('name').isString().notEmpty().withMessage('Name is required'),
	validateRequest,
];

export const signup = async (req: Request, res: Response, next: NextFunction) => {
	const { username, password, name } = req.body;
	logger.info(`Signup request received for user: ${username}`);
	try {
		const user = await AuthService.signup(username, password, name);
		logger.info(`User: ${username} created successfully`);
		res.status(201).json({ message: 'User created successfully', user });
	} catch (error: any) {
		logger.error(`Signup failed for user: ${username} - ${error.message}`);
		next(error);
	}
};

// Validate login route, then perform login and save token to cookie
export const validateLogin = [
	body('username').isString().notEmpty().withMessage('Username is required'),
	body('password').isString().notEmpty().withMessage('Username is required'),
	validateRequest,
];

export const login = async (req: Request, res: Response, next: NextFunction) => {
	const { username, password } = req.body;
	try {
		logger.info(`Login request received for user: ${username}`);
		const { token, user } = await AuthService.login(username, password);
		logger.info(token ? `Login successful for user: ${username}` : `Login failed for user: ${username}`);

		res.cookie('token', token, {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
		});

		res.status(200).json({
			message: 'Logged in successfully',
			user: { id: user.id, username: user.username, name: user.name },
		});
	} catch (error: any) {
		logger.error(`Login failed for user: ${username} - ${error.message}`);
		next(error);
	}
};

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
	// Extract token from cookies
	const token = req.cookies.token;
	if (!token) {
		logger.info('No authentication token provided');
		return res.sendStatus(401);
	}

	jwt.verify(token, config.jwtSecret, (error: any, user: { userId: number; username: string }) => {
		if (error) {
			logger.error(`Token verification failed - ${error.message}`);
			return res.sendStatus(403);
		}
		// Add custom data to request object
		req.userId = user.userId;
		req.username = user.username;

		// logger.info(`Token authenticated with user: ${user.username}- ${user.userId}`);
		next();
	});
};

export const logout = async (req: Request, res: Response) => {
	logger.info('Logout request received');
	// Clear the token cookie from the client
	res.clearCookie('token');
	res.status(200).json({ message: 'Logged out successfully' });
};
