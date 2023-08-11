import express from 'express';
import {
	getBankHubUrl,
	getBankHubAccessToken,
	getBankHubTransactions,
	getBankHubAuth,
	getBankHubBanks,
	postBankHubTransfer,
	validateTransferBody,
	getFiServices,
} from '../controllers/bankHubController';
import { authenticateToken } from '../controllers/authController';

export const bankHubRoute = express.Router();

bankHubRoute.get('/url', getBankHubUrl);
bankHubRoute.post('/access-token', authenticateToken, getBankHubAccessToken);
bankHubRoute.post('/transactions', getBankHubTransactions);
bankHubRoute.post('/auth', getBankHubAuth);
bankHubRoute.get('/banks', getBankHubBanks);
bankHubRoute.post('/transfer', validateTransferBody, authenticateToken, postBankHubTransfer);
bankHubRoute.get('/fi-services', getFiServices);
