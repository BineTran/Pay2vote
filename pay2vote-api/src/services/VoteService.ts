import config from '../../config';
import { processTransaction } from './TransactionService';
import { calculatePoints } from './PriceService';
import { getAccessTokenByEventId } from '@/models/eventsModel';
import { logger } from '@/utils/logger';
import { transactionBH, transactionDB } from './ScheduleService.types';
import { sendTeamsPointsToEventRoom } from './SocketService';
import { getAllTrans } from '@/models/transModel';
import makeRequest from '@/utils/api';
import { AppError } from '@/errors';
import { fakeDataBine } from './TransactionService.mock';

const fetchTransDB = async () => {
	const start = Date.now();
	try {
		const response = await getAllTrans();
		return response;
	} catch (error) {
		logger.error(error, 'Error in fetching transaction from db:');
		return;
	} finally {
		const end = Date.now();
		logger.info(`Execution time of fetchTransDB: ${end - start}ms`);
	}
};

const fetchTransBH = async (eventId: number) => {
	const start = Date.now();
	try {
		const url = `${config.serverDomain}/api/v1/bankhub/transactions`;
		const accessToken = await getAccessTokenByEventId(eventId);
		if (!accessToken) {
			throw new AppError(400, 'No access token provided');
		}
		logger.info(
			{
				eventId,
				url,
				logToken: accessToken.slice(0, 5) + '...',
			},
			`${accessToken ? 'Access token' : 'No access token'} received, starting request with:`,
		);

		// Using new request helper
		// const responseData = await makeFetchRequest(url, 'POST', {}, { accessToken });
		const responseData = await makeRequest('POST', url, {}, { accessToken });

		logger.info({ accountName: responseData.accounts[0].accountName }, 'Response from transactions received');

		return responseData;
	} catch (error: any) {
		logger.error('Error in fetching BankHub transaction');
		throw error;
	} finally {
		const end = Date.now();
		logger.info(`Execution time of fetchTransBH: ${end - start}ms`);
	}
};

const filterTransaction = (dbData: transactionDB[], bhData: transactionBH[]): transactionBH[] => {
	return bhData.filter((bhTransaction) =>
		dbData.every((dbTransaction) => bhTransaction.reference !== dbTransaction.reference),
	);
};
/**
 * Fetches transaction data from two sources and filters out those
 * transactions from BankHub that already exist in the database.
 * Throws an error if data format is unexpected.
 *
 * @param {number} eventId - ID of the event for which to fetch transactions.
 * @returns {Promise<transactionBH[]>} - Promise that resolves to an array of new transactions from BankHub.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchAndFilterTransactions = async (eventId: number) => {
	try {
		const [dataDB, dataBH]: any = await Promise.all([fetchTransDB(), fetchTransBH(eventId)]);

		if (!Array.isArray(dataDB) || !dataBH || !Array.isArray(dataBH.transactions)) {
			throw new Error('Unexpected data format received');
		}

		const transDataDB: transactionDB[] = dataDB;
		const transDataBH: transactionBH[] = dataBH.transactions;

		const newTransactionsFromBH = filterTransaction(transDataDB, transDataBH);

		return newTransactionsFromBH;
	} catch (error: any) {
		logger.error('Error happen in fetch both transactions from DB and BH');
		throw error;
	}
};

/**
 * Processes transactions to label them and save them to the database.
 * If there is at least one valid transaction, emits a message to inform
 * clients to re-fetch the data.
 *
 * @param {transactionBH[]} newTransactions - New transactions from BankHub.
 * @param {number} eventId - ID of the event to which the transactions belong.
 */
const processDataAndEmitIfValid = async (newTransactions: transactionBH[], eventId: number) => {
	// Labeling transactions and save them to database
	// Return true if there is one trans that valid
	const isOneValid = await processTransaction(newTransactions);
	logger.info(isOneValid ? 'Transaction valid exist' : 'No transaction valid');

	// Emit a message that tell client to re-fetch
	if (isOneValid) {
		const teamsPoints = await calculatePoints(eventId);
		sendTeamsPointsToEventRoom(eventId, teamsPoints);
	}
};

/**
 * Main function that fetches and processes transactions. If a similar task
 * is already running, this task is skipped. Execution time is logged.
 *
 * @param {number} eventId - ID of the event for which to fetch and process transactions.
 * @returns {Promise<void>}
 */
export const fetchData = async (eventId: number): Promise<void> => {
	// Get new transactions from BankHub
	// const newTransFromBH = await fetchAndFilterTransactions(eventId);
	const newTransFromBH = fakeDataBine;

	// Process the new transactions and label valid or invalid
	if (!newTransFromBH) {
		logger.info('No new transaction from BankHub');
	} else {
		logger.info('Found new transactions from Bankhub');
		await processDataAndEmitIfValid(newTransFromBH, eventId);
	}
};

export const processActiveEvents = async (activeEvents: Set<string>) => {
	logger.info([...activeEvents], `Ready to process ${activeEvents.size} active events`);
	for (const eventId of activeEvents) {
		const eventIdNumber = parseInt(eventId, 10);
		logger.info(`Processing event with id ${eventIdNumber}`);
		await fetchData(eventIdNumber);
	}
};
