import { Request, Response, NextFunction } from 'express';
import { calculatePoints } from '../services/PriceService';
import {
	createPointModel,
	getEventIDbyTeamIDModel,
	getPointChartModel,
	getFirstTransPointModel,
} from '../models/pointEventTeamModel';
import { TeamPoints } from '../services/PriceService';

export const createPointCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const eventID = parseInt(req.params.eventID, 10);
		const pointTeam: TeamPoints[] = await calculatePoints(eventID);
		pointTeam.map(async (item: TeamPoints) => {
			const data = {
				point: item.points,
				event_id: eventID,
				team_id: item.team_id,
			};
			await createPointModel(data);
		});
		res.status(201).json({ message: 'point created successfully' });
	} catch (error: any) {
		next(error);
	}
};

export const getFirstTransPointCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const eventID = parseInt(req.params.eventID, 10);
		const result = await getFirstTransPointModel({ eventID: eventID });
		res.status(200).json(result);
	} catch (error: any) {
		next(error);
	}
};

export const getPointChartCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const eventID = parseInt(req.params.eventID, 10);
		const time = req.params.time;
		const limit = parseInt(req.params.limit, 10);
		const data = {
			eventID: eventID,
			time: time,
			limit: limit,
		};
		const result = await getPointChartModel(data);
		res.status(200).json(result);
	} catch (error: any) {
		next(error);
	}
};

export const getEventIDbyTeamID = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const teamID = parseInt(req.params.teamID, 10);
		const data = {
			teamID: teamID,
		};
		const result = await getEventIDbyTeamIDModel(data);
		res.status(200).json(result);
	} catch (error: any) {
		next(error);
	}
};
