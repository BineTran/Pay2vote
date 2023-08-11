export const convertToNumber: (value: string | null) => number = (value) => {
	if (value === null) return -1;
	const number = Number(value);
	return isNaN(number) ? -1 : number;
};
