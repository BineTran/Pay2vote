import express from 'express';
import {
	checkTransIsRefundingCon,
	refundAllTransInvalidCon,
	refundSelectedTransCon,
} from '@/controllers/refundController';
import { authenticateToken } from '@/controllers/authController';

export const refundRoute = express.Router();
refundRoute.get('/eventID/:eventID', authenticateToken, refundAllTransInvalidCon);
refundRoute.get('/refunding/:eventID', checkTransIsRefundingCon);
refundRoute.get('/selected/:transID', authenticateToken, refundSelectedTransCon);
