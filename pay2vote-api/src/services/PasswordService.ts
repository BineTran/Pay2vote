const bcrypt = require('bcrypt');

export const hashPassword = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, userPassword: string) => {
	return await bcrypt.compare(password, userPassword);
};
