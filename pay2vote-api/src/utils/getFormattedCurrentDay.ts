/**
 * Gets the current date and formats it in the YYYY-MM-DD format.
 *
 * @returns {string} The current date in the YYYY-MM-DD format.
 */
export const getFormattedCurrentDay = (): string => {
	const date = new Date();
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
};
