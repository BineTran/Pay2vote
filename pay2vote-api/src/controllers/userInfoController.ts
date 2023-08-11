import { NextFunction, Request, Response } from 'express';
import makeRequest from '../utils/api';
import config from '../../config';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/requestValidator';
import { logger } from '@/utils/logger';

export const validateAccessToken = [
	body('accessToken').isString().notEmpty().withMessage('Missing public key'),
	validateRequest,
];

export const getUserAuth = async (req: Request, res: Response, next: NextFunction) => {
	logger.info('Request get user info received');
	const accessToken: string = req.body.accessToken;

	// Config request
	const headers = {
		'x-client-id': config.clientId,
		'x-secret-key': config.secretKey,
		Authorization: accessToken,
	};

	try {
		const response = await makeRequest('GET', `${config.bankhubSandboxUrl}/auth`, headers);
		logger.info('Received response from bankhub');
		res.send(response);
	} catch (error: any) {
		next(error);
	}
};

export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.userId;
	const accessToken: string = req.body.accessToken;
	logger.info(`User with userId: ${userId} called get user info`);
	try {
		// We need this uuid: string;  code: string;  name: string;  type: string;  logo: string;
		const { name, account_number, account_name } = await makeRequest(
			'GET',
			`${config.serverDomain}/api/v1/user/fi-service-account/${userId}`,
			{},
			{ accessToken },
		);
		const { username } = await makeRequest('GET', `${config.serverDomain}/api/v1/user/account/id/${userId}`);

		const result = {
			username,
			name,
			account_number,
			account_name,
		};

		res.send(result);
	} catch (error: any) {
		next(error);
	}
};

export const getUserRefundInfo = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.userId;
	const accessToken: string = req.body.accessToken;
	logger.info(`User with userId: ${userId} called get user info`);
	try {
		// We need this uuid: string;  code: string;  name: string;  type: string;  logo: string;
		const { name, account_number, account_name } = await makeRequest(
			'GET',
			`${config.serverDomain}/api/v1/user/fi-service-account/refund/${userId}`,
			{},
			{ accessToken },
		);
		const { username } = await makeRequest('GET', `${config.serverDomain}/api/v1/user/account/id/${userId}`);

		const result = {
			username,
			name,
			account_number,
			account_name,
		};

		res.send(result);
	} catch (error: any) {
		next(error);
	}
};
