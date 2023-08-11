import { Request, Response, NextFunction } from 'express';
import {
	getAllTrans,
	getTrans,
	createTrans,
	updateTrans,
	deleteTrans,
	getTransByTeamID,
	getAllTransByEventId,
	updateStatusTransToSuccess,
	getAllTransInvalid,
	getAllTransInvalidByEventID,
	getAllTransPendingByEventID,
	updateTransStatusRefunding,
	getTransByTeamIDValid,
} from '../models/transModel';
import { convertDate } from '@/utils/convertFromISO8601';
import { logger } from '@/utils/logger';

export const getAllTransPendingByEventIDCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const eventID = req.params.eventID;
		const allTranPending = await getAllTransPendingByEventID(eventID);
		res.status(200).json(allTranPending);
	} catch (error: any) {
		next(error);
	}
};

export const getAllTransInvalidByEventIDCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const eventID = req.params.eventID;
		const allTransInv = await getAllTransInvalidByEventID(eventID);
		allTransInv.map((item: any, index: any) => {
			item.transaction_datetime = convertDate(item.transaction_datetime);
			item.ID = index + 1;
			item.amount = Math.floor(item.amount)
				.toString()
				.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			item.transaction_status =
				item.transaction_status.charAt(0).toUpperCase() + item.transaction_status.slice(1);
			item.amount_remaining = Math.floor(item.amount_remaining)
				.toString()
				.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		});
		logger.info('Get all transactions invalid successfully');
		res.status(200).json(allTransInv);
	} catch (error: any) {
		next(error);
	}
};

export const getAllTransInvalidCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const allTransInv = await getAllTransInvalid();
		allTransInv.map((item: any, index: any) => {
			item.transaction_datetime = convertDate(item.transaction_datetime);
			item.ID = index + 1;
			item.amount = Math.floor(item.amount)
				.toString()
				.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			item.transaction_status =
				item.transaction_status.charAt(0).toUpperCase() + item.transaction_status.slice(1);
		});
		logger.info('Get all transactions invalid successfully');
		res.status(200).json(allTransInv);
	} catch (error: any) {
		next(error);
	}
};

export const getTransByTeamIDCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const teamID = req.params.teamID;
		const transByTeamID = await getTransByTeamID(teamID);
		transByTeamID.map((item: any, index: any) => {
			item.transaction_datetime = convertDate(item.transaction_datetime);
			item.ID = index + 1;
			item.amount = Math.floor(item.amount)
				.toString()
				.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		});
		res.status(200).json(transByTeamID);
	} catch (error: any) {
		next(error);
	}
};

export const getTransByTeamIDValidCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const teamID = req.params.teamID;
		const transByTeamID = await getTransByTeamIDValid(teamID);
		transByTeamID.map((item: any, index: any) => {
			item.transaction_datetime = convertDate(item.transaction_datetime);
			item.ID = index + 1;
			item.amount = Math.floor(item.amount)
				.toString()
				.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		});
		res.status(200).json(transByTeamID);
	} catch (error: any) {
		next(error);
	}
};

export const getTransByEventIDCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const eventID = req.params.eventID;
		const transByEventID = await getAllTransByEventId(eventID);
		transByEventID.map((item: any, index: any) => {
			item.transaction_datetime = convertDate(item.transaction_datetime);
			item.ID = index + 1;
			item.amount = Math.floor(item.amount)
				.toString()
				.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
			item.transaction_status =
				item.transaction_status.charAt(0).toUpperCase() + item.transaction_status.slice(1);
		});
		res.status(200).json(transByEventID);
		logger.info('Get Transaction by EventID successfully!');
	} catch (error: any) {
		next(error);
	}
};

export const getAllTransCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const transAllGet = await getAllTrans();
		res.status(200).json(transAllGet);
	} catch (error: any) {
		next(error);
	}
};

export const getTransCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const transID = req.params.transID;
		const transGET = await getTrans(transID);
		res.status(200).json(transGET);
	} catch (error: any) {
		next(error);
	}
};

export const createTransCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await createTrans(req.body);
		res.status(201).json({ message: 'transaction created successfully' });
	} catch (error: any) {
		next(error);
	}
};

export const updateTransCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await updateTrans(req.body);
		res.status(201).json({ message: 'transaction update successfully' });
	} catch (error: any) {
		next(error);
	}
};

export const updateStatusTransToSuccessCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await updateStatusTransToSuccess(req.body);
		res.status(201).json({ message: 'Update transaction_status successfully' });
	} catch (error: any) {
		next(error);
	}
};

export const updateTransStatusRefundingCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const transID = req.params.transID;
		await updateTransStatusRefunding(transID);
		res.status(201).json({ message: 'Update transaction_status is refunding' });
	} catch (error: any) {
		next(error);
	}
};

export const deleteTransCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await deleteTrans(req.body);
		res.status(201).json({ message: 'transaction delete successfully' });
	} catch (error: any) {
		next(error);
	}
};
