type Headers = {
	[key: string]: string;
};
type RequestData = {
	[key: string]: any;
};

export const makeFetchRequest = async (
	url: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	headers: Headers = {},
	data: RequestData = {},
) => {
	// Exclude out other methods, we use rest api for now
	if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method.toUpperCase())) {
		throw new Error('Invalid method, must be GET, POST, PUT or DELETE');
	}

	// Check for url
	if (!url) {
		throw new Error('URL must be provided');
	}

	// Config request
	const config: {
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		headers: Headers;
		body?: string;
	} = {
		method: method,
		headers: {
			...headers,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	// GET and DELETE are not allowed to have a body
	if (['POST', 'PUT'].includes(method.toUpperCase())) {
		config.body = JSON.stringify(data);
	}

	// Make request
	try {
		const response = await fetch(url, config);
		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		}
		return await response.json();
	} catch (error: any) {
		console.error(`Error making ${method} request to ${url}: ${error.message}`);
		throw error;
	}
};
