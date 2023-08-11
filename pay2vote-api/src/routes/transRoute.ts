import {
	createTransCon,
	deleteTransCon,
	getAllTransCon,
	getTransByTeamIDCon,
	getTransCon,
	updateTransCon,
	getTransByEventIDCon,
	updateStatusTransToSuccessCon,
	getAllTransInvalidCon,
	getAllTransInvalidByEventIDCon,
	getAllTransPendingByEventIDCon,
	updateTransStatusRefundingCon,
	getTransByTeamIDValidCon,
} from '@/controllers/transController';
import express from 'express';

export const transRoute = express.Router();

transRoute.get('/teamID/:teamID', getTransByTeamIDCon);
transRoute.get('/teamID/valid/:teamID', getTransByTeamIDValidCon);
transRoute.get('/id/:transID', getTransCon);
transRoute.get('/eventID/:eventID', getTransByEventIDCon);
transRoute.get('/getAll', getAllTransCon);
transRoute.get('/getAllInvalid', getAllTransInvalidCon);
transRoute.get('/getAllInvalidByEventID/:eventID', getAllTransInvalidByEventIDCon);
transRoute.get('/getAllPending/:eventID', getAllTransPendingByEventIDCon);
transRoute.post('/create', createTransCon);
transRoute.put('/update', updateTransCon);
transRoute.delete('/delete', deleteTransCon);
transRoute.post('/update/transaction_status', updateStatusTransToSuccessCon);
transRoute.get('/update/transaction_status/refunding/:transID', updateTransStatusRefundingCon);
