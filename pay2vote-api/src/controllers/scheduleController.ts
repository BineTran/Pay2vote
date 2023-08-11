import { AppError } from '@/errors';
import { getAllEvent } from '@/models/eventsModel';
import { activeEvents } from '@/services/SocketService';
import { fetchData, processActiveEvents } from '@/services/VoteService';
import { logger } from '@/utils/logger';
import { Request, Response, NextFunction } from 'express';

export const refreshVotesOfAnEvent = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { eventId } = req.body;
		if (!eventId) {
			throw new AppError(400, 'Event Id not found');
		}
		const events = await getAllEvent();
		const isEventExist = events.some((event) => event.id === eventId);
		if (!isEventExist) {
			throw new AppError(404, 'Event not found');
		}

		// Event exist, proceed
		await fetchData(eventId);

		res.status(200).json({
			message: 'Refresh votes successfully',
		});
	} catch (error: any) {
		logger.error(error.message, 'An error occur in refreshVotes controller');
		next(error);
	}
};

export const refreshVotesActiveEvents = async (req: Request, res: Response, next: NextFunction) => {
	logger.info('Refreshing vote of all events...');
	try {
		if (activeEvents.size === 0) {
			return res.status(200).json({ message: 'No active event' });
		}
		await processActiveEvents(activeEvents);
		return res.status(200).json({ message: 'Successfully refresh all event' });
	} catch (error: any) {
		next(error);
	}
};
