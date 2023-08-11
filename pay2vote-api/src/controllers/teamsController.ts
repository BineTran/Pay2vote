import { Request, Response, NextFunction } from 'express';
import * as teamModel from '@/models/teamsModel';
import { body } from 'express-validator';
import { validateRequest } from '@/middlewares/requestValidator';
import { getEventById } from '@/models/eventsModel';
import { AppError } from '@/errors';

export const validateTeam = [
	body('name').isString().notEmpty().withMessage('Name of team must not empty'),
	body('description').isString().notEmpty().withMessage('Description of team must not empty'),
	body('event_id').isNumeric().notEmpty().withMessage('Event id of team must not empty'),
	validateRequest,
];

export const validateUpdateTeam = [
	body('name').optional().isString().withMessage('Name of team must be string'),
	body('description').optional().isString().withMessage('Description of team must be string'),
	body('event_id').optional().isNumeric().withMessage('Event id of team must be integer'),
	validateRequest,
];

export const getAllTeam = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const result = await teamModel.getAllTeam();
		res.status(200).json(result);
	} catch (error: any) {
		next(error);
	}
};

export const getTeamById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const teamId = parseInt(req.params.teamId, 10);

		// Check team id exist
		if (isNaN(teamId)) {
			throw new AppError(400, 'Invalid team ID');
		}
		const result = await teamModel.getTeamById(teamId);

		// Check result exist
		if (!result) {
			throw new AppError(404, 'Team not found');
		}

		res.status(200).json(result);
	} catch (error: any) {
		next(error);
	}
};

export const getTeamByEventId = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const eventId = parseInt(req.params.eventId, 10);
		// Check event id exist
		if (isNaN(eventId)) {
			throw new AppError(400, 'Invalid event ID');
		}

		const result = await teamModel.getTeamByEventId(eventId);

		// Check result exist
		if (!result) {
			throw new AppError(404, 'Team not found');
		}

		res.status(200).json(result);
	} catch (error: any) {
		next(error);
	}
};

export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, description, event_id, avatar_name } = req.body;

		// Parse event id number
		const event_id_number = parseInt(event_id, 10);
		if (isNaN(event_id_number)) {
			throw new AppError(400, 'Invalid Event ID, must be a number.');
		}

		// Check if event id exist
		const event = await getEventById(event_id_number);
		if (!event) {
			throw new AppError(404, 'Event ID not found.');
		}

		await teamModel.createTeam({
			name,
			description,
			avatar_name,
			event_id: event_id_number,
		});

		res.status(201).json({ message: 'Team created successfully.' });
	} catch (error: any) {
		next(error);
	}
};

export const updateTeam = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = parseInt(req.params.teamId, 10);

		// Check if team ID exist
		if (isNaN(id)) throw new AppError(400, 'No team ID provided');

		// Check if team exists before updating
		const existingTeam = await teamModel.getTeamById(id);
		if (!existingTeam) throw new AppError(404, 'Team not found');

		await teamModel.updateTeam(id, req.body);
		res.status(201).json({ message: 'Team updated successfully.' });
	} catch (error: any) {
		next(error);
	}
};

export const deleteTeam = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const teamId = parseInt(req.params.teamId);
		// Check team id exist
		if (isNaN(teamId)) {
			throw new AppError(400, 'Invalid team ID, must be a number.');
		}

		// Check team exist
		const team = await teamModel.getTeamById(teamId);
		if (!team) {
			throw new AppError(404, 'Team not found');
		}

		await teamModel.deleteTeam(teamId);
		res.status(201).json({ message: 'Team delete successfully' });
	} catch (error: any) {
		next(error);
	}
};
