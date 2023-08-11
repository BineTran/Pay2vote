import { hashPassword } from '../services/PasswordService';
import prisma from '../libs/prisma';
import { Prisma } from '@prisma/client';

export interface User {
	id: number;
	username: string;
	password: string;
	name: string;
	created_at: Date;
	updated_at: Date;
}

export const createUser = async (user: Prisma.usersCreateInput) => {
	try {
		await prisma.users.create({
			data: user,
		});
	} catch (error) {
		console.error('Error in creating user:', error);
		throw error;
	}
};

export const getUserByUserId = async (user_id: number) => {
	try {
		const result = await prisma.users.findUnique({
			where: { id: user_id },
		});
		return result;
	} catch (error) {
		console.error('Error in get user by user id:', error);
		throw error;
	}
};

export const getUserByUsername = async (username: string) => {
	try {
		const result = await prisma.users.findUnique({
			where: { username: username },
		});
		return result;
	} catch (error) {
		console.error('Error in get user by user id:', error);
		throw error;
	}
};

interface UpdatableUserFields {
	password?: string;
	name?: string;
}

export const updateUser = async (user: UpdatableUserFields & { id: number }) => {
	let hashedUser: UpdatableUserFields = { ...user };

	// If the password is present, hash it
	if (user.password) {
		hashedUser = {
			...hashedUser,
			password: await hashPassword(user.password),
		};
	}

	await prisma.users.update({
		where: {
			id: user.id,
		},
		data: hashedUser,
	});
};

export const deleteUser = async (id: number): Promise<void> => {
	try {
		await prisma.users.delete({
			where: { id },
		});
	} catch (error) {
		console.error('Error in delete user:', error);
		throw error;
	}
};
