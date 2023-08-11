import { NextFunction, Request, Response } from 'express';
import { saveImagePathToEvent, saveImagePathToTeam } from '../models/imageModel';
import path from 'path';
const { v4: uuidv4 } = require('uuid');
import multer from 'multer';
import { logger } from '@/utils/logger';
import { AppError } from '@/errors';

// File upload handling middleware
const uploadImageMiddleware = multer({
	storage: multer.diskStorage({
		destination: (req: any, res: any, cb: any) => {
			cb(null, 'public/images');
		},
		filename: (req: any, file: any, cb: any) => {
			cb(null, uuidv4() + path.extname(file.originalname));
		},
	}),
}).single('image');

export type UploadHandler = (req: Request, path: string) => Promise<void>;

export const uploadImage = (handleUpload: UploadHandler = async () => {}) => [
	uploadImageMiddleware,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.file) {
				throw new AppError(400, 'No file provided');
			}

			const webFriendlyPath = req.file.path.replace(/\\/g, '/');
			await handleUpload(req, webFriendlyPath);

			res.status(200).json({
				message: 'File uploaded successfully',
				filePath: webFriendlyPath,
			});
		} catch (error: any) {
			next(error);
		}
	},
];

// This callback is used for team avatar upload, to save path to database
export const handleTeamImageUpload: UploadHandler = async (req: Request, webFriendlyPath: string) => {
	const teamId = parseInt(req.params.teamId);
	if (isNaN(teamId)) {
		throw new AppError(404, 'Invalid or missing teamId');
	}
	await saveImagePathToTeam(webFriendlyPath, teamId);
	logger.info(`This is path of image saved to team: ${webFriendlyPath}`);
};

// This callback is used for event avatar upload, to save path to database
export const handleEventImageUpload: UploadHandler = async (req: Request, webFriendlyPath: string) => {
	const eventId = parseInt(req.params.eventId);
	if (isNaN(eventId)) {
		throw new AppError(404, 'Invalid or missing eventId');
	}
	await saveImagePathToEvent(webFriendlyPath, eventId);
	logger.info(`This is path of image saved to event: ${webFriendlyPath}`);
};
