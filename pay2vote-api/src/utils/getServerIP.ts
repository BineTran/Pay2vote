const os = require('os');

// Function to get the server IP address
export function getServerIp() {
	const ifaces = os.networkInterfaces();
	let ip = '';

	for (const dev in ifaces) {
		ifaces[dev].forEach((details: any) => {
			if (details.family === 'IPv4' && details.internal === false) {
				ip = details.address;
			}
		});
	}

	return ip;
}
