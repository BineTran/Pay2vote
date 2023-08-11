import prisma from '@/libs/prisma';
import { queryDB } from '../utils/db';

export type Event = {
	id: number;
	name: string;
	user_id: number;
	description: string;
	avatar_path: string;
	created_at: Date;
	updated_at: Date;
};

export const getAllEventForAdminByUserId = async (userID: any): Promise<Event[]> => {
	const query = `
		SELECT id, name, user_id, description, avatar_path, created_at, updated_at
		FROM events
		WHERE user_id = ?
	`;
	const result = await queryDB(query, [userID]);
	return result;
};

export const getAllEvent = async (): Promise<Event[]> => {
	const query = 'SELECT id, name, user_id, description, avatar_path, created_at, updated_at FROM events';
	const result = await queryDB(query);
	return result;
};

export const getEventById = async (eventId: number): Promise<Event | null> => {
	const query = 'SELECT id, name, user_id, description, avatar_path, created_at, updated_at FROM events WHERE id = ?';
	const result = await queryDB(query, [eventId]);
	if (result.length === 0) {
		return null;
	} else {
		return result[0];
	}
};

export const createEvent = async (userId: number, data: Partial<Event>) => {
	const query = 'INSERT INTO events (name, user_id, description, avatar_path) VALUES (?, ?, ?, ?)';
	const result = await queryDB(query, [data.name, userId, data.description, data.avatar_path]);
	return result;
};

export const updateEvent = async (data: Event) => {
	const query = 'UPDATE events SET name = ?, user_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
	await queryDB(query, [data.name, data.user_id, data.id]);
};

export const deleteEvent = async (eventId: number) => {
	const query = 'DELETE FROM events WHERE id = ?';
	const result = await queryDB(query, [eventId]);
	return result;
};

export const getEventIdByUserId = async (userId: number) => {
	const sql = 'SELECT * FROM events WHERE user_id = ?';
	await queryDB(sql, [userId]);
};

export const getAccessTokenByEventId = async (eventId: number) => {
	const result = await prisma.events.findUnique({
		where: { id: eventId },
		include: {
			users: {
				select: {
					fi_service_account: {
						select: {
							access_token: true,
						},
					},
				},
			},
		},
	});
	return result?.users?.fi_service_account?.access_token;
};
