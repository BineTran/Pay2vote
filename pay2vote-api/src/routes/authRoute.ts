import express from 'express';
import {
	login,
	signup,
	validateLogin,
	validateSignup,
	// authenticateToken,
	logout,
} from '../controllers/authController';

export const authRoute = express.Router();

authRoute.post('/login', validateLogin, login);

authRoute.post('/signup', validateSignup, signup);

authRoute.get('/logout', logout);
