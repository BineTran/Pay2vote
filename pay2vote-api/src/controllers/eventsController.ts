import { Request, Response, NextFunction } from 'express';
import * as eventModel from '@/models/eventsModel';
import { logger } from '@/utils/logger';
import { getUserByUserId } from '@/models/userAccountModel';
import { AppError } from '@/errors';
import { getEventById } from '@/models/eventsModel';
import { CreateResult } from '.';
import { body } from 'express-validator';
import { validateRequest } from '@/middlewares/requestValidator';

export const validateEvent = [
	body('name').isString().notEmpty().withMessage('Name must not be empty'),
	validateRequest,
];

export const getAllEventConForAdmin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userID = req.userId;
		const events = await eventModel.getAllEventForAdminByUserId(userID);
		res.status(200).json(events);
	} catch (error: any) {
		next(error);
	}
};

export const getAllEventCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// const userID = req.userId;
		// console.log(userID);
		const events = await eventModel.getAllEvent();
		res.status(200).json(events);
	} catch (error: any) {
		next(error);
	}
};

export const getEventCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const eventID = parseInt(req.params.eventID, 10);
		if (!eventID) {
			throw new AppError(400, 'Event id not provided or not a number');
		}
		const event = await eventModel.getEventById(eventID);
		if (!event) {
			throw new AppError(404, 'Event not found');
		}
		res.status(200).json(event);
	} catch (error: any) {
		next(error);
	}
};

export const createEventCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = req.userId as number;

		const user = await getUserByUserId(userId);
		if (!user) {
			throw new AppError(404, `Invalid user with user id ${userId}`);
		}
		const result: CreateResult = await eventModel.createEvent(userId, req.body);
		if (result.affectedRows > 0) {
			logger.info(result, `An event with event id ${result.insertId} created by user id: ${userId}`);
		} else {
			throw new AppError(500, 'Internal server error');
		}

		res.status(201).json({ message: 'Event created successfully' });
	} catch (error: any) {
		next(error);
	}
};

export const updateEventCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await eventModel.updateEvent(req.body);
		res.status(201).json({ message: 'event updated successfully' });
	} catch (error: any) {
		next(error);
	}
};

export const deleteEventCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId = req.userId as number;

		const eventId = parseInt(req.params.eventID, 10);
		if (!eventId) {
			const errorMessage = `Invalid event id - ${eventId}`;
			logger.error(errorMessage);
			throw new AppError(400, errorMessage);
		}

		const event = await getEventById(eventId);
		if (!event) {
			throw new AppError(404, 'Event not found');
		}

		if (event.user_id !== userId) {
			throw new AppError(401, 'Unauthorized user');
		}

		const result = await eventModel.deleteEvent(eventId);
		logger.info(result, 'Event deleted');
		if (!result) {
			throw new AppError(500, 'Interal server error');
		}

		res.status(201).json({ message: 'Event delete successfully' });
	} catch (error: any) {
		next(error);
	}
};
