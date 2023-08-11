import express, { Express, Request, Response } from 'express';
const cors = require('cors');
const cookieParser = require('cookie-parser');
import { errorHandler } from './src/middlewares/errorHandler';
import { routes } from './src/routes';
// import { authenticateToken } from './src/controllers/authController';
import config from 'config';
import { logger } from '@/utils/logger';
import { getServerIp } from '@/utils/getServerIP';
import { getSocketIOServer } from '@/services/SocketService';

const app: Express = express();
const port = config.port;

const serverIp = getServerIp();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const io = getSocketIOServer();

// app.options(config.clientDomain, cors());

app.use(
	cors({
		origin: [config.clientDomain],
		credentials: true,
	}),
);

app.use(express.json());

app.use(cookieParser());

app.use('/public', express.static('public'));

// app.use(authenticateToken);

app.use('/oi', async (req: Request, res: Response) => {
	res.status(200).json({ message: 'hello' });
});

app.use('/api/v1', routes);

app.use(errorHandler);

app.listen(port, () => {
	logger.info(`Is this dev ? ${config.isDev} This is node env: ${process.env.NODE_ENV}`);
	logger.info(`Client domain: ${config.clientDomain}`);
	logger.info(`[server]: Server is running at ${config.serverDomain} or http://${serverIp}:${port}`);
});
