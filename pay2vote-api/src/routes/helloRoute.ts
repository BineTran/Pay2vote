import express from 'express';

import { getHello } from '../controllers/helloController';

export const helloRoute = express.Router();

helloRoute.get('/', getHello);
