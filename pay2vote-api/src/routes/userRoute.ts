import express from 'express';
import { getUserInfo, getUserAuth, validateAccessToken, getUserRefundInfo } from '../controllers/userInfoController';
import * as UserController from '../controllers/userAccountController';
import { validateUser } from '../controllers/userAccountController';
import {
	validateAccount,
	getFiServiceAccount,
	createFiServiceAccount,
	updateFiServiceAccount,
	deleteFiServiceAccount,
} from '../controllers/fiServiceAccountController';
import { authenticateToken } from '../controllers/authController';
import { getFiServiceRefundAccount } from '../controllers/fiServiceAccountController';

export const userRoute = express.Router();

// This api get user auth info from bankhub (account, fiservice, ...)
userRoute.post('/auth', validateAccessToken, getUserAuth);

// This api return user information (username, email, account name, account number, BIN, ...)
userRoute.post('/info', authenticateToken, validateAccessToken, getUserInfo);
userRoute.post('/refund-info', authenticateToken, validateAccessToken, getUserRefundInfo);

// This api work with user table
userRoute.post('/account', validateUser, UserController.createUserAccount);
userRoute.get('/account/id/:user_id', UserController.getUserAccountByUserId);
userRoute.get('/account/username/:username', UserController.getUserAccountByUsername);
userRoute.put('/account', UserController.updateUserAccount);
userRoute.delete('/account/:user_id', UserController.deleteUserAccount);

// This api work with fi_service
userRoute.post('/fi-service-account', validateAccount, createFiServiceAccount);
userRoute.get('/fi-service-account/:user_id', getFiServiceAccount);
userRoute.get('/fi-service-account/refund/:user_id', getFiServiceRefundAccount);
userRoute.put('/fi-service-account', updateFiServiceAccount);
userRoute.delete('/fi-service-account/:user_id', deleteFiServiceAccount);
