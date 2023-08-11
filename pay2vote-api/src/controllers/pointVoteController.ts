import { Request, Response, NextFunction } from 'express';
import { calculatePoints } from '../services/PriceService';

export const getPointOfEvent = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const eventID = parseInt(req.params.eventID, 10);
		const pointTeam = await calculatePoints(eventID);
		res.status(200).json(pointTeam);
	} catch (error: any) {
		next(error);
	}
};
