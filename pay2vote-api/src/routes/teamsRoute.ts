import express from 'express';
import * as teamsControl from '@/controllers/teamsController';

export const teamsRoute = express.Router();

teamsRoute.get('/id/:teamId', teamsControl.getTeamById);
teamsRoute.get('/eventId/:eventId', teamsControl.getTeamByEventId);
teamsRoute.get('/getAll', teamsControl.getAllTeam);
teamsRoute.post('/create', teamsControl.validateTeam, teamsControl.createTeam);
teamsRoute.put('/update/:teamId', teamsControl.validateUpdateTeam, teamsControl.updateTeam);
teamsRoute.delete('/delete/:teamId', teamsControl.deleteTeam);
