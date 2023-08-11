import express from 'express';
import { votePriceCon } from '@/controllers/votePriceController';

export const priceRoute = express.Router();

priceRoute.get('/eventID/:eventID', votePriceCon);
