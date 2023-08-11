import express from 'express';
import {
	createPointCon,
	getPointChartCon,
	getEventIDbyTeamID,
	getFirstTransPointCon,
} from '../controllers/pointEventTeamController';

export const pointTeamRoute = express.Router();
pointTeamRoute.get('/createPoint/:eventID', createPointCon);
pointTeamRoute.get('/getPoint/:eventID/:time/:limit', getPointChartCon);
pointTeamRoute.get('/getEventIDByTeamID/:teamID', getEventIDbyTeamID);
pointTeamRoute.get('/getFirstTransPointCon/:eventID', getFirstTransPointCon);
