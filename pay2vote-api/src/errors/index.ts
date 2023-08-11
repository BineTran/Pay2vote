export class AppError extends Error {
	statusCode: number;
	details?: any;
	isOperational: boolean;

	constructor(statusCode: number, message: string, isOperational = true, stack = '', details?: any) {
		super(message);
		this.statusCode = statusCode;
		this.details = details;
		this.name = this.constructor.name;
		this.isOperational = isOperational;
		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
		Object.setPrototypeOf(this, AppError.prototype);
	}
}
