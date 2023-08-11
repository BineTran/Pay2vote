import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { HttpError } from 'http-errors';
import { AppError } from '@/errors';
import { logger } from '@/utils/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	const correlationId = uuidv4(); // for tracing error in logs

	logger.error(
		{
			timestamp: new Date().toISOString(),
			correlationId: correlationId,
			method: req.method,
			url: req.originalUrl,
			error: {
				type: err.type || err.name,
				message: err.message,
				stack: err.stack,
				details: JSON.stringify(err.details, null, 2),
			},
		},
		'An error occur',
	);

	// Check if error is instance of AppError
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			correlationId,
			error: {
				type: err.name,
				message: err.message,
				details: err.details,
			},
		});
	}

	// Check if error is instance of HttpError (for example from 'http-errors' package)
	if (err instanceof HttpError) {
		return res.status(err.statusCode).json({
			correlationId,
			error: {
				type: err.name,
				message: err.message,
			},
		});
	}

	// Default error response
	return res.status(500).json({
		correlationId,
		error: {
			type: 'InternalServerError',
			message: err.message,
		},
	});
};
