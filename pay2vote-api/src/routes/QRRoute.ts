import express from 'express';

import { getUrlEventCon } from '../controllers/QRController';

export const QRRoute = express.Router();

QRRoute.get('/getAllEvent/:eventID', getUrlEventCon);
