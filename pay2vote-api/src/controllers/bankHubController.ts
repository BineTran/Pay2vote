import { NextFunction, Request, Response } from 'express';
import makeRequest from '../utils/api';
import config from '../../config';
import { saveInfoToFiServiceAccount } from '../services/AccountService';
import { logger } from '@/utils/logger';
import { upsertBanks } from '@/models/banks.model';
import { getAccessTokenByUserId, getRefundAccessTokenByUserId } from '@/models/fiServiceAccountModel';
import { AppError } from '@/errors';
import { body } from 'express-validator';
import { validateRequest } from '@/middlewares/requestValidator';
import { getFormattedCurrentDay } from '@/utils/getFormattedCurrentDay';
import { upsertFiServices } from '@/models/fiServices.model';

export type FIAccountType = 'normal' | 'refund';

export const getBankHubUrl = async (req: Request, res: Response) => {
	// Host URL
	const HOST = config.clientDomain;

	// Config
	const requestMethod = 'POST';
	const url = `${config.bankhubSandboxUrl}/grant/token`;
	const headers = {
		'x-client-id': config.clientId,
		'x-secret-key': config.secretKey,
	};
	const data = {
		scopes: 'transaction,identity,transfer',
		redirectUri: HOST,
		language: 'vi',
	};

	// Grant token from sandbox bankhub
	try {
		logger.info('Requesting grant token...');
		const response = await makeRequest(requestMethod, url, headers, data);
		logger.info('Received grant token');
		const grantToken: string = response.grantToken;
		const bankHubUrl = `https://dev.link.bankhub.dev/?redirectUri=${HOST}&grantToken=${grantToken}`;
		logger.info('BankHub URL created');
		res.send({ bankHubUrl });
		logger.info('BankHub Url sent');
	} catch (error) {
		logger.error(error, 'Failed to get BankHub URL');
		res.status(500).send(error);
	}
};

// This is actually a post method
export const getBankHubAccessToken = async (req: Request, res: Response) => {
	// Extract public token
	const publicToken: string = req.body.publicToken;
	if (!publicToken) {
		throw new AppError(400, 'No public token provided');
	}

	const accountType: FIAccountType = req.body.accountType;
	if (!accountType) {
		throw new AppError(400, 'No account type provided');
	}

	const userId = req.userId as number;

	logger.info({ publicToken, accountType }, 'Get access token request received');

	// Define property for post request
	const requestMethod = 'POST';
	const url = `${config.bankhubSandboxUrl}/grant/exchange`;
	const headers = {
		'x-client-id': config.clientId,
		'x-secret-key': config.secretKey,
	};
	const data = {
		publicToken: publicToken,
	};

	// Request for access token
	try {
		logger.info('Exchanging public token for access token...');
		const response = await makeRequest(requestMethod, url, headers, data);
		const accessToken = response.accessToken;
		logger.info(accessToken ? 'Received access token' : 'Access token do not exist');

		// When got this access token, perform save user fi service to fi_service_account
		await saveInfoToFiServiceAccount(accessToken, userId, accountType).then(() =>
			logger.info('Saved infomation to fi user account table'),
		);

		res.send({ response });
		logger.info('Access token sent to client');
	} catch (error: any) {
		logger.error(error, 'Failed to get access token');
		res.status(500).send(error);
	}
};

export const getBankHubTransactions = async (req: Request, res: Response) => {
	// Get access token from body sent by client
	const accessToken = req.body.accessToken;

	const today = getFormattedCurrentDay();

	// Config request
	const method = 'GET';
	const url = `${config.bankhubSandboxUrl}/transactions?fromDate=${today}&toDate=${today}`;
	const headers = {
		'x-client-id': config.clientId,
		'x-secret-key': config.secretKey,
		Authorization: accessToken,
	};

	// Request
	try {
		logger.info('Fetching transactions...');
		const response = await makeRequest(method, url, headers);
		logger.info('Received transactions');
		res.send(response);
	} catch (error: any) {
		logger.error(error, 'Failed to fetch transactions');
		res.status(500).send(error);
	}
};

export const getBankHubAuth = async (req: Request, res: Response) => {
	// Get access token from body sent by client
	const accessToken = req.body.accessToken;

	// Config request
	const method = 'GET';
	const url = `${config.bankhubSandboxUrl}/auth`;
	const headers = {
		'x-client-id': config.clientId,
		'x-secret-key': config.secretKey,
		Authorization: accessToken,
	};

	// Request
	try {
		logger.info(
			`Fetching auth data ${accessToken ? `with ${accessToken.slice(0, 5)}...` : 'without'} access token...`,
		);
		const response = await makeRequest(method, url, headers);
		logger.info('Received auth data');
		res.send(response);
	} catch (error: any) {
		logger.error(error, 'Failed to fetch auth data');
		res.status(500).send(error);
	}
};

export const getBankHubBanks = async (req: Request, res: Response) => {
	const url = 'https://api.vietqr.io/v2/banks';
	try {
		logger.info('Fetching banks...');
		const response = await makeRequest('GET', url);
		logger.info('Received banks');
		//Save banks from bankhub to banks table in database
		await upsertBanks(response.data);

		res.send(response);
	} catch (error) {
		logger.error(error, 'Failed to fetch banks');
		res.status(500).send(error);
	}
};

type TransferBodyTypes = {
	fromAccountNumber: string;
	toBin: string;
	toAccountNumber: string;
	amount: number;
	description: string;
};

export const validateTransferBody = [
	body('fromAccountNumber').notEmpty().withMessage('fromAccountNumber is required').isString(),
	body('toBin').notEmpty().withMessage('toBin is required').isString(),
	body('toAccountNumber').notEmpty().withMessage('toAccountNumber is required').isString(),
	body('amount')
		.notEmpty()
		.withMessage('amount is required')
		.custom((value) => {
			if (typeof value === 'number') {
				return true;
			} else {
				throw new AppError(400, 'amount must be a number');
			}
		}),
	body('description').notEmpty().withMessage('description is required').isString(),
	validateRequest,
];

export const postBankHubTransfer = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.userId;
	if (!userId) {
		throw new AppError(401, 'Unauthorized');
	}

	const accessTokenObject = await getRefundAccessTokenByUserId(userId);
	if (!accessTokenObject) {
		throw new AppError(404, 'User access token not found');
	}

	// Can't destructuring out of a null
	const { access_token: accessToken } = accessTokenObject;
	logger.info(accessToken ? `Access token received with ${accessToken.slice(0, 5)}...` : 'Access token not exist');

	// Build request
	const url = `${config.bankhubSandboxUrl}/transfer`;
	const header = {
		'x-client-id': config.clientId,
		'x-secret-key': config.secretKey,
		Authorization: accessToken,
	};
	const body: TransferBodyTypes = req.body;

	logger.info(body, 'Body of transfer request');

	try {
		logger.info('Starting post bankhub transfer...');
		const response = await makeRequest('POST', url, header, body);
		logger.info(response, 'Response from bankhub transfer');
		res.send(response);
	} catch (error: any) {
		next(error);
	}
};
export const getFiServices = async (req: Request, res: Response, next: NextFunction) => {
	const userId = 22;
	if (!userId) {
		throw new AppError(401, 'Unauthorized');
	}

	const accessTokenObject = await getAccessTokenByUserId(userId);
	if (!accessTokenObject) {
		throw new AppError(404, 'User access token not found');
	}

	// Can't destructuring out of a null
	const { access_token: accessToken } = accessTokenObject;
	logger.info(accessToken ? `Access token received with ${accessToken.slice(0, 5)}...` : 'Access token not exist');

	// Build request
	const url = `${config.bankhubSandboxUrl}/fi-services`;
	const header = {
		'x-client-id': config.clientId,
		'x-secret-key': config.secretKey,
		Authorization: accessToken,
	};

	try {
		const response = await makeRequest('GET', url, header);
		console.log(typeof response, response);
		upsertFiServices(response.fiServices);
		res.send(response);
	} catch (error: any) {
		next(error);
	}
};
