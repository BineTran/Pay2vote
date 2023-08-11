import * as teamsModel from '@/models/teamsModel';
import { TeamPoints, calculatePoints, calculateVotePoints } from './PriceService';
import { createPointModel } from '@/models/pointEventTeamModel';
import { notifyNewVoteToEventRoom } from './SocketService';
import { Team, getEventIdByTeamId } from '@/models/teamsModel';
import { logger } from '@/utils/logger';
import { Transaction, TransactionRow } from './TransactionService.types';
import { createTrans } from '@/models/transModel';
import { getAllPriceByEventId } from '@/models/priceModel';
import { Bank, findBanks } from '@/models/banks.model';
import { FiService, getAllFiServices } from '@/models/fiServices.model';

export const VOTE_STATUS = {
	VALID: 'valid',
	INVALID: 'invalid',
};

export const REFUND_MINIMUM_AMOUNT = 10000;

export const REFUND_STATUS = {
	VALID: 'valid',
	PENDING: 'pending',
	COMPLETE: 'complete',
	NON_REFUNDABLE: 'nonrefundable',
};

export const DESTINATION_INVALID_BANK = [
	{
		counter_account_bank_id: '888899',
		bin: '970407',
		// techcom
	},
	{
		counter_account_bank_id: '981957',
		bin: '970432',
		// vp bank
	},
	{
		counter_account_bank_id: '970488',
		bin: '970418',
		// bidv
	},
];

const extractTeamIdFromRegexCode = (text: string) => {
	const regex = /(CASV)(\d+)CASV/;
	const match = regex.exec(text);
	return match ? parseInt(match[2]) : null;
};

const saveToPointsHistoryTable = async (points: TeamPoints[], eventId: number) => {
	try {
		const createPointsPromises = points.map((item: TeamPoints) =>
			createPointModel({
				point: item.points,
				event_id: eventId,
				team_id: item.team_id,
			}),
		);
		await Promise.all(createPointsPromises);
	} catch (error) {
		console.error(error);
	}
};

const savePointHistory = async (eventId: number) => {
	const points = await calculatePoints(eventId);
	await saveToPointsHistoryTable(points, eventId);
};

const getTeamId = (transaction: Transaction, teams: Team[]): number => {
	try {
		const teamIdInitial = extractTeamIdFromRegexCode(transaction.description);
		const teamExist: boolean =
			Number.isInteger(teamIdInitial) && teams.some((team: { id: number }) => team.id === teamIdInitial);
		const teamId = teamExist ? teamIdInitial : null;
		if (!teamId) {
			throw new Error('Team id is missing');
		}
		return teamId;
	} catch (error: any) {
		logger.error(error.message, 'Error in getTeamId');
		throw error;
	}
};

const getEventId = async (teamId: number): Promise<number> => {
	try {
		const result = await getEventIdByTeamId(teamId);
		const eventId = result?.event_id;
		if (!eventId) {
			throw new Error('Team not having a valid event id');
		}
		return eventId;
	} catch (error: any) {
		logger.error(error.message, 'Error in getEventId');
		throw error;
	}
};

export const processBIN = (bankId: string, banks: Bank[]): string => {
	// Pattern for numeric string
	const pattern = /^\d+$/;

	if (pattern.test(bankId)) {
		// Maybe a BIN or new BIN that not compatible to old BIN
		const bank = banks.find((bank) => bank.bin === bankId);
		if (bank) {
			return bank.bin;
		}

		const newBINObject = DESTINATION_INVALID_BANK.find((object) => object.counter_account_bank_id === bankId);
		if (newBINObject) {
			return newBINObject.bin;
		}
	} else {
		// This may be a swift code
		const bank = banks.find((bank) => bank.swift_code === bankId);
		if (bank) {
			return bank.bin;
		}
	}
	return bankId;
};

export const processRefundStatus = (transaction: Transaction, remaining_amount: number, lowestPrice: number) => {
	// Refund logic
	const isRemainingAmount = remaining_amount > 0;
	const isAmountGreaterThanLowestPrice = transaction.amount >= lowestPrice;
	const isCounterAccountExist = transaction.counterAccountNumber !== '';
	// const isAmountMinimumAmount = transaction.amount >= REFUND_MINIMUM_AMOUNT;
	const isRefundAmountMinimumAmount = remaining_amount >= REFUND_MINIMUM_AMOUNT;
	const isRefundable = isRefundAmountMinimumAmount ? REFUND_STATUS.PENDING : REFUND_STATUS.NON_REFUNDABLE;
	const isNonRefundable = isCounterAccountExist ? isRefundable : REFUND_STATUS.NON_REFUNDABLE;

	// Transaction params
	const status = isAmountGreaterThanLowestPrice ? VOTE_STATUS.VALID : VOTE_STATUS.INVALID;
	const transaction_status = isRemainingAmount ? isNonRefundable : REFUND_STATUS.VALID;

	return { status, transaction_status };
};
/**
 * Processes a list of transactions, extracting team IDs from descriptions and marking them as valid or invalid.
 * A valid transaction has a description formatted as '<CASV><number><CASV>', where <number> is a valid team ID.
 * All other descriptions are marked as invalid.
 * Each transaction, regardless of its validity, is saved to the database.
 * If at least one valid transaction is found, returns a boolean indicating it.
 *
 * @param {Transaction[]} transactions - An array of transaction objects to be processed.
 * @returns {Promise<boolean>} - Promise that resolves to a boolean value indicating if there's at least one valid transaction.
 */
export const processTransaction = async (transactions: Transaction[]): Promise<boolean> => {
	const start = Date.now();
	logger.info({ transactionsCount: transactions.length }, 'Processing transactions...');

	const teams: Team[] = await teamsModel.getAllTeam();
	const banks: Bank[] = await findBanks();
	const fiServices: FiService[] = await getAllFiServices();

	const promises = transactions.map(processSingleTransaction(teams, banks, fiServices));

	let isOneValid = false;

	try {
		const results = await Promise.allSettled(promises);

		for (const result of results) {
			if (result.status === 'fulfilled') {
				if (result.value === VOTE_STATUS.VALID) {
					isOneValid = true;
					break; // No need to check further
				}
			} else if (result.status === 'rejected') {
				// logger.error('Failed to process a transaction: result.reason');
				// Do nothing, there is enough log
			}
		}
	} catch (error) {
		logger.error(error, 'Failed to process transactions:');
	}

	const end = Date.now();
	logger.info('Execution time of process transaction:', end - start + 'ms');

	return isOneValid;
};

const processSingleTransaction = (teams: Team[], banks: Bank[], fiServices: FiService[]) => {
	return async (transaction: Transaction) => {
		logger.info(`Processing single transaction with reference ${transaction.reference}...`);

		// Get nessessary params
		const teamId = getTeamId(transaction, teams);
		const eventId = await getEventId(teamId);

		// Save points to point history table
		await savePointHistory(eventId);

		// Calculate amount_remaining
		// const priceList = await getAllPriceByEventId(eventId); I WAS FORCED BY DARK VADER, I DO NOT WANT THIS
		const priceList = await getAllPriceByEventId(4);
		const lowestPrice = priceList.reduce((min, price) => Math.min(min, price.price), Infinity);
		const { points, remaining_amount } = calculateVotePoints(transaction.amount, priceList);
		console.log('this is the points:', points);

		const { status, transaction_status } = processRefundStatus(transaction, remaining_amount, lowestPrice);

		const processedBIN = processBIN(transaction.counterAccountBankId, banks);

		const data: TransactionRow = {
			team_id: teamId,
			transaction_datetime: transaction.transactionDateTime,
			reference: transaction.reference,
			payment_chanel: transaction.paymentChannel,
			counter_account_bank_id: processedBIN, // This have 3 cases: BIN, Swift code, new BIN (need to convert to old BIN)
			counter_account_number: transaction.counterAccountNumber,
			counter_account_name: transaction.counterAccountName,
			description: transaction.description,
			status: status,
			amount: transaction.amount,
			transaction_status: transaction_status,
			amount_remaining: remaining_amount,
		};

		// After check, save them to database by transaction model
		try {
			logger.info(data, 'Save new transaction in database');
			await createTrans(data);
			notifyNewVoteToEventRoom(eventId, data, fiServices, points);
		} catch (error) {
			logger.error(error, `Failed to process transaction ${transaction.reference}:`);
		}
		logger.info(
			{ transactionId: transaction.reference, teamId, remaining_amount },
			'Finished processing single transaction.',
		);
		return status;
	};
};
