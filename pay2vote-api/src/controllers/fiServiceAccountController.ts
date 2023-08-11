import { Request, Response, NextFunction } from 'express';
import { FiServiceAccount, createAccount, updateAccount, deleteAccountByUserId } from '../models/fiServiceAccountModel';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/requestValidator';
import { getAccountByUserId } from '@/models/fiServiceAccountModel';

export const validateAccount = [
	body('uuid').isUUID(),
	body('code').isString().notEmpty().withMessage('Code must not be empty'),
	body('name').isString().notEmpty().withMessage('Name must not be empty'),
	body('type').isString().notEmpty().withMessage('Type must not be empty'),
	body('logo').isString().notEmpty().withMessage('Logo must not be empty'),
	body('user_id').isNumeric(),
	body('access_token').isString().notEmpty().withMessage('Access token must not be empty'),
	body('account_number').isString().notEmpty().withMessage('Account number must not be empty'),
	body('account_name').isString().notEmpty().withMessage('Account name must not be empty'),
	body('bin').isString().notEmpty().withMessage('BIN must not be empty'),
	validateRequest,
];

export const createFiServiceAccount = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await createAccount(req.body);
		res.status(201).json({
			message: 'Fi Service Account created successfully',
		});
	} catch (error: any) {
		next(error);
	}
};

export const getFiServiceAccount = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user_id = parseInt(req.params.user_id, 10);
		const account = await getAccountByUserId(user_id);
		res.status(200).json(account);
	} catch (error: any) {
		next(error);
	}
};

export const getFiServiceRefundAccount = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user_id = parseInt(req.params.user_id, 10);
		const account = await getAccountByUserId(user_id, 'refund');
		res.status(200).json(account);
	} catch (error: any) {
		next(error);
	}
};

export const updateFiServiceAccount = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const account = req.body as Partial<FiServiceAccount> & {
			user_id: number;
		};
		if (!account.user_id) {
			const error = new Error('user_id is required');
			return next(error);
		}
		await updateAccount(account);
		res.status(200).json({
			message: 'Fi Service Account updated successfully',
		});
	} catch (error: any) {
		next(error);
	}
};

export const deleteFiServiceAccount = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user_id = parseInt(req.params.user_id, 10);
		await deleteAccountByUserId(user_id);
		res.status(200).json({
			message: 'Fi Service Account deleted successfully',
		});
	} catch (error: any) {
		next(error);
	}
};
