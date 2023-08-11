import express from 'express';
import { handleTeamImageUpload, uploadImage } from '../controllers/imageController';

export const imageRoute = express.Router();

imageRoute.post('/team/:teamId', uploadImage(handleTeamImageUpload));
imageRoute.post('/image', uploadImage());
