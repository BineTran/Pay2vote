const express = require('express');
import * as eventsController from '@/controllers/eventsController';
import { authenticateToken } from '@/controllers/authController';
import { validateEvent } from '@/controllers/eventsController';

export const eventsRoute = express.Router();

eventsRoute.get('/id/:eventID', eventsController.getEventCon);
eventsRoute.get('/getall', eventsController.getAllEventCon);
eventsRoute.get('/getallforad', authenticateToken, eventsController.getAllEventConForAdmin);
eventsRoute.post('/create', authenticateToken, validateEvent, eventsController.createEventCon);
eventsRoute.put('/update', eventsController.updateEventCon);
eventsRoute.delete('/delete/:eventID', authenticateToken, eventsController.deleteEventCon);
