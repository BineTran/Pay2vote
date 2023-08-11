import { AppError } from '@/errors';
import { getRefundAccessTokenByUserId } from '@/models/fiServiceAccountModel';
import { checkTransIsRefunding, refundAllTransInvalid, refundSelectedTrans } from '@/models/refundModel';
import { getAllTransPendingByEventID, getTrans } from '@/models/transModel';
import { getSocketIOServer } from '@/services/SocketService';
import { logger } from '@/utils/logger';
import { Request, Response, NextFunction } from 'express';

export const refundAllTransInvalidCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = req.userId;
		if (!userId) {
			throw new AppError(401, 'Unauthorized');
		}
		const eventID = req.params.eventID;
		const accessTokenObject = await getRefundAccessTokenByUserId(userId);
		if (!accessTokenObject) {
			throw new AppError(404, 'User access token not found');
		}
		// Can't destructuring out of a null
		const { access_token: accessToken } = accessTokenObject;
		logger.info(accessToken ? 'Access token received' : 'Access token not exist');
		const allTransPending = await getAllTransPendingByEventID(eventID);
		if (allTransPending.length === 0) {
			res.status(200).json({ message: 'There are no transactions to refund!' });
			logger.warn('There are no transactions to refund!');
			return;
		}
		res.status(200).json({ message: 'Refunding all your transactions!' });
		let result: any;
		const socketServer = getSocketIOServer();
		try {
			await refundAllTransInvalid(accessToken, allTransPending);
			logger.info('Refund all transaction process started');
			socketServer.emit('status_refund_all', {
				status: 'success',
				message: 'Transactions successfully refunded',
			});
		} catch (error: any) {
			socketServer.emit('status_refund_all', {
				status: 'failed',
				message: 'The refund process for all transactions has been interrupted. Please try again.',
			});
		}
		logger.info(result, 'Result of refund');
		return;
	} catch (error: any) {
		next(error);
	}
};

export const checkTransIsRefundingCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const eventID = req.params.eventID;
		const response = await checkTransIsRefunding(eventID);
		res.status(201).json(response);
	} catch (error: any) {
		next(error);
	}
};

export const refundSelectedTransCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = req.userId;
		if (!userId) {
			throw new AppError(401, 'Unauthorized');
		}
		const transID = req.params.transID;
		const transactionInform = await getTrans(transID);
		const accessTokenObject = await getRefundAccessTokenByUserId(userId);
		if (!accessTokenObject) {
			throw new AppError(404, 'User access token not found');
		}
		// Can't destructuring out of a null
		const { access_token: accessToken } = accessTokenObject;
		res.status(200).json({ message: 'Transaction is being refunded' });

		const socketServer = getSocketIOServer();

		try {
			await refundSelectedTrans(accessToken, transactionInform);
			socketServer.emit('status_refund', { status: 'success', message: 'Transaction successfully refunded' });
			logger.info(
				`Successfully refunded a transaction with ${transID} by user ${userId} with ${accessToken.slice(
					0,
					5,
				)}...`,
			);
		} catch (error: any) {
			logger.error(`Failed to refund a transaction with id ${transID}, status code ${error.response.status}`);
			if (error.response.status === 400) {
				socketServer.emit('status_refund', {
					status: 'failed',
					message: 'Cannot refund this transaction',
				});
			} else if (error.response.status === 429) {
				socketServer.emit('status_refund', {
					status: 'failed',
					message: 'Too many request, please try again later',
				});
			} else {
				socketServer.emit('status_refund', {
					status: 'failed',
					message: 'Something is wrong, please try again later',
				});
			}

			throw error;
		}
		return;
	} catch (error: any) {
		next(error);
	}
};
