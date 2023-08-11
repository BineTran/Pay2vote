import axios, { AxiosResponse, Method } from 'axios';
import { logger } from './logger';

type Headers = {
	[key: string]: string;
};

type RequestData = {
	[key: string]: any;
};

const makeRequest = async (
	method: Method,
	url: string,
	headers: Headers = {},
	data: RequestData = {},
): Promise<AxiosResponse['data']> => {
	// Exclude out other methods, we use rest api for now
	if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method.toUpperCase())) {
		throw new Error('Invalid method, must be GET, POST, PUT or DELETE');
	}

	// Check url
	if (!url) {
		throw new Error('URL must be provided');
	}

	// Config request
	const config: {
		method: Method;
		url: string;
		headers: Headers;
		data?: string;
	} = {
		method: method,
		url: url,
		headers: {
			...headers,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	// GET and DELETE are not allowed to have a body
	if (['POST', 'PUT'].includes(method.toUpperCase())) {
		config.data = JSON.stringify(data);
	}

	// Make request
	try {
		const response = await axios(config);
		return response.data;
	} catch (error: any) {
		logger.error(`Error making ${method} request to ${url}: ${error.message}`);
		throw error;
	}
};

export default makeRequest;
