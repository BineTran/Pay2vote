import config from 'config';
import {
	getAllRefundingByEventID,
	updateStatusTransToSuccess,
	updateTransStatusPending,
	updateTransStatusRefunding,
} from './transModel';
import { logger } from '@/utils/logger';
import makeRequest from '@/utils/api';
import { getSocketIOServer } from '@/services/SocketService';

export const refundAllTransInvalid = async (access_token: string, allTransPending: any) => {
	const response = [];

	for (const [index, value] of allTransPending.entries()) {
		const socketServer = getSocketIOServer();
		const socketServerEventName = 'status_refund_all';
		// Build request
		logger.info(value, 'Refunding this transaction');
		const transID = value.id;
		await updateTransStatusRefunding(transID);
		if (index !== 0) {
			await new Promise((resolve) => setTimeout(resolve, 60000));
		}

		const url = `${config.bankhubSandboxUrl}/transfer`;
		const header = {
			'x-client-id': config.clientId,
			'x-secret-key': config.secretKey,
			Authorization: access_token,
		};
		const body: any = {
			fromAccountNumber: '0003100024608005',
			toBin: value.counter_account_bank_id,
			toAccountNumber: value.counter_account_number,
			amount: value.amount_remaining,
			description: 'test transfer bankhub',
		};

		let amount = body.amount;
		while (amount >= 10000) {
			body.amount = 10000;
			amount -= 10000;
			logger.info('Starting post bankhub transfer...');
			try {
				const response_element = await makeRequest('POST', url, header, body);
				response.push(response_element);
				logger.info(response_element, 'Response from bankhub transfer');
				socketServer.emit(socketServerEventName, {
					status: 'success',
					message: 'Transaction or part of it successfully refunded',
				});
			} catch (error: any) {
				// await new Promise((resolve) => setTimeout(resolve, 60000));
				updateTransStatusPending(transID);
				logger.error(error, 'Refunding Error');
				if (error.response.status === 400) {
					socketServer.emit(socketServerEventName, {
						status: 'failed',
						message: 'Cannot refund this transaction',
					});
				} else if (error.response.status === 429) {
					socketServer.emit(socketServerEventName, {
						status: 'failed',
						message: 'Too many request, please try again later',
					});
				} else {
					socketServer.emit(socketServerEventName, {
						status: 'failed',
						message: 'Something is wrong, please try again later',
					});
				}
				throw error;
			}
			console.log('continue running');

			if (amount < 10000) break;
			await new Promise((resolve) => setTimeout(resolve, 60000));
		}
		const dataUpdate = {
			amount: amount,
			id: value.id,
		};
		await updateStatusTransToSuccess(dataUpdate);
	}
	return response;
};

export const checkTransIsRefunding = async (eventID: any) => {
	const allTransRefunding = await getAllRefundingByEventID(eventID);
	if (allTransRefunding.length > 0) return { status: 'refunding' };
	return { status: 'not refunding' };
};

export const refundSelectedTrans = async (access_token: string, transactionInform: any) => {
	const response = [];
	await updateTransStatusRefunding(transactionInform.id);
	const url = `${config.bankhubSandboxUrl}/transfer`;
	const header = {
		'x-client-id': config.clientId,
		'x-secret-key': config.secretKey,
		Authorization: access_token,
	};
	const body = {
		fromAccountNumber: '0003100024608005',
		toBin: transactionInform.counter_account_bank_id,
		toAccountNumber: transactionInform.counter_account_number,
		amount: transactionInform.amount_remaining,
		description: 'test transfer bankhub',
	};

	let amount = body.amount;
	while (amount >= 10000) {
		body.amount = 10000;
		amount -= 10000;
		try {
			const response_element = await makeRequest('POST', url, header, body);
			response.push(response_element);
		} catch (error: any) {
			updateTransStatusPending(transactionInform.id);
			logger.error(error, 'Refunding Error');
			throw error;
		}
		if (amount < 10000) break;
		await new Promise((resolve) => setTimeout(resolve, 60000));
	}
	const dataUpdate = {
		amount: amount,
		id: transactionInform.id,
	};
	await updateStatusTransToSuccess(dataUpdate);
	return response;
};
