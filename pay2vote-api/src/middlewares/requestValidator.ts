import { AppError } from '@/errors';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		throw new AppError(400, 'Validation Error', true, '', { validationError: errors.array() });
	}
	next();
};
