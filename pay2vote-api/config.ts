import { logger } from '@/utils/logger';
import dotenv from 'dotenv';
import path from 'path';

const pathString = path.resolve(__dirname, `.env.${process.env.NODE_ENV}`);
logger.info(`Path: ${pathString}`);

dotenv.config({ path: pathString });

const config = {
	nodeEnv: process.env.NODE_ENV as string,
	isDev: process.env.IS_DEV as string,
	port: process.env.PORT as string,
	clientId: process.env.X_CLIENT_ID as string,
	secretKey: process.env.X_SECRET_KEY as string,
	bankhubSandboxUrl: process.env.BANKHUB_SANDBOX_URL as string,
	serverDomain: process.env.SERVER_DOMAIN as string,
	clientDomain: process.env.CLIENT_DOMAIN as string,
	jwtSecret: process.env.JWT_SECRET as string,
	testAccessToken: process.env.TEST_ACCESS_TOKEN as string,
	socketioPort: parseInt(process.env.SOCKET_IO_PORT as string, 10),
};

export default config;
