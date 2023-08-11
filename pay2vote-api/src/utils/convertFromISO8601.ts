export const convertDate = (isoDate: string): string => {
	// Convert ISO 8601 timestamp to JavaScript Date object
	const date = new Date(isoDate);

	// Extract the time
	const hours = date.getUTCHours().toString().padStart(2, '0');
	const minutes = date.getUTCMinutes().toString().padStart(2, '0');
	const seconds = date.getUTCSeconds().toString().padStart(2, '0');
	const time = `${hours}:${minutes}:${seconds}`;

	// Extract the date
	const day = date.getUTCDate().toString().padStart(2, '0');
	const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
	const year = date.getUTCFullYear();
	const dateStr = `${day}-${month}-${year}`;

	// Combine and return
	return `${time} ${dateStr}`;
};
