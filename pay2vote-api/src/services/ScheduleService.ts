const cron = require('node-cron');
import { logger } from '@/utils/logger';
import makeRequest from '@/utils/api';
import config from 'config';
// import { fakeDataBine } from './TransactionService.test';

logger.info('Schedule service file started');

const callSchedule = () => {
	let isRunning = false;
	return async () => {
		logger.info('============================================================');
		if (isRunning) {
			logger.info('Previous task still running, skipping...');
			return;
		}
		isRunning = true;
		try {
			const start = Date.now();
			const response = await makeRequest('GET', `${config.serverDomain}/api/v1/schedule/refresh-all`);
			const end = Date.now();
			logger.info(`${response.message}, execution time: ${end - start}ms`);
		} catch (error: any) {
			logger.error(error.message, 'An error occurred in calling schedule');
		} finally {
			isRunning = false;
			logger.info('============================================================');
		}
	};
};

const schedule = callSchedule();

export const startSchedule = () => {
	logger.info('Inside startSchedule function');
	// This line to get the server socket, if not get it, the whole fetchData cant run
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	cron.schedule('*/15 * * * * *', () => {
		logger.info('Service starting...');
		// for (const eventId of activeEvents) {
		// 	schedule(parseInt(eventId, 10));
		// }
		schedule();
	});
};

try {
	startSchedule();
} catch (error) {
	logger.error(error, 'Failed to start the service');
}
