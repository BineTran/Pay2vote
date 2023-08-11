import { getPointOfEvent } from '../controllers/pointVoteController';
import express from 'express';

export const pointEvent = express.Router();
pointEvent.get('/getPoint/:eventID', getPointOfEvent);
