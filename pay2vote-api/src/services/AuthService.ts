import { comparePassword, hashPassword } from './PasswordService';
import { createUser, getUserByUsername } from '../models/userAccountModel';
const jwt = require('jsonwebtoken');
import config from '../../config';
import { logger } from '@/utils/logger';

export const signup = async (username: string, password: string, name: string) => {
	const hashedPassword: string = await hashPassword(password);
	const user = createUser({ username, password: hashedPassword, name });
	logger.info(`User ${username} in signing up`);
	return user;
};

export const login = async (username: string, password: string) => {
	const user = await getUserByUsername(username);

	if (!user) {
		throw new Error('User not found');
	}

	const isPasswordMatch = await comparePassword(password, user.password as string);

	if (!isPasswordMatch) {
		throw new Error('Incorrect password');
	}

	const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: '60d' });
	logger.info('Token created in login api');

	return { token, user };
};
