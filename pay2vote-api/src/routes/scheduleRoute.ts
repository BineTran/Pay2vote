import { refreshVotesActiveEvents, refreshVotesOfAnEvent } from '@/controllers/scheduleController';
import express from 'express';

export const scheduleRoute = express.Router();

scheduleRoute.post('/refresh', refreshVotesOfAnEvent);
scheduleRoute.get('/refresh-all', refreshVotesActiveEvents);
