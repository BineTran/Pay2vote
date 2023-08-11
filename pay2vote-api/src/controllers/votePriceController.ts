import { Request, Response, NextFunction } from 'express';
import { getAllPriceByEventId } from '@/models/priceModel';

export const votePriceCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const eventID = parseInt(req.params.eventID, 10);
		const result = await getAllPriceByEventId(eventID);
		res.status(200).json(result);
	} catch (error: any) {
		next(error);
	}
};
