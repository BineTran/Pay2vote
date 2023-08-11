import { queryDB } from '../utils/db';
import prisma from '../libs/prisma';

type Price = {
	price: number;
	point: number;
};

export const getAllPriceByEventId = async (eventId: number) => {
	const sql = 'SELECT price, point FROM vote_price WHERE event_id = ?';
	const result: Price[] = await queryDB(sql, [eventId]);
	return result;
};

export const findAllPriceByEventId = async (eventId: number) => {
	const result = await prisma.vote_price.findMany({
		where: {
			event_id: eventId,
		},
		select: {
			price: true,
			point: true,
		},
	});
	return result;
};
