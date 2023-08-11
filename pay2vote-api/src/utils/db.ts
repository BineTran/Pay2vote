const dotenv = require('dotenv');
import mysql from 'mysql2/promise';
import { Pool } from 'mysql2/promise';
import { logger } from './logger';
const findConfig = require('find-config');

const config = findConfig('.env');
dotenv.config({ path: config ? config : undefined });

interface DBConfig {
	host: string;
	user: string;
	password: string;
	database: string;
}

const dbConfig: DBConfig = {
	host: process.env.MYSQL_HOST || '',
	user: process.env.MYSQL_USER || '',
	password: process.env.MYSQL_PASSWORD || '',
	database: process.env.MYSQL_DATABASE || '',
};

if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
	console.error('Database configuration error: Check your .env file');
	process.exit(1);
}

export const pool: Pool = mysql.createPool(dbConfig);

export const connectDB = async () => {
	try {
		const connection = await pool.getConnection();
		logger.info('Connected to database');
		connection.release();
	} catch (err) {
		console.error('Error connecting to database:', err);
		process.exit(1);
	}
};

export const queryDB = async (query: string, params?: any): Promise<any> => {
	try {
		const [results] = await pool.query(query, params);
		// console.log('Query results:', results);
		return results;
	} catch (error) {
		console.error('Error executing query:', error);
		throw error;
	}
};

connectDB();
