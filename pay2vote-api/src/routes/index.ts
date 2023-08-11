import { helloRoute } from './helloRoute';
import { userRoute } from './userRoute';
import { eventsRoute } from './eventsRoute';
import { transRoute } from './transRoute';
import { teamsRoute } from './teamsRoute';
import { bankHubRoute } from './bankHubRoute';
import express from 'express';
import { authRoute } from './authRoute';
import { imageRoute } from './imageRoute';
import { QRRoute } from './QRRoute';
import { pointEvent } from './pointVoteRoute';
import { pointTeamRoute } from './pointEventTeamRoute';
import { refundRoute } from './refundRoute';
import { scheduleRoute } from './scheduleRoute';
import { priceRoute } from './priceRoute';

export const routes = express.Router();

// Test protected route
routes.use('/', helloRoute);

routes.use('/auth', authRoute);

// // Below this are protected routes
// routes.use(authenticateToken);

routes.use('/bankhub', bankHubRoute);

routes.use('/user', userRoute);

routes.use('/event', eventsRoute);

routes.use('/transaction', transRoute);

routes.use('/team', teamsRoute);

routes.use('/upload', imageRoute);

routes.use('/qr', QRRoute);

routes.use('/pointEvent', pointEvent);

routes.use('/pointTeam', pointTeamRoute);

routes.use('/refund', refundRoute);

routes.use('/price', priceRoute);

routes.use('/schedule', scheduleRoute);
