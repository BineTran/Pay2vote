import prisma from '@/libs/prisma';
import { queryDB } from '@/utils/db';

export interface Team {
	id: number;
	name: string;
	description: string;
	avatar_name: string | null;
	event_id: number;
	created_at: Date | null;
	updated_at: Date | null;
}

interface CreateTeam {
	name: string;
	description: string;
	event_id: number;
	avatar_name: string | null;
}

interface UpdateTeam extends CreateTeam {
	id: number;
}

export const getAllTeam = async () => {
	try {
		const result = await prisma.teams.findMany();
		return result;
	} catch (error) {
		console.error('Error in get all teams:', error);
		throw error;
	}
};

export const getTeamById = async (id: number) => {
	try {
		const team = await prisma.teams.findUnique({
			where: {
				id: id,
			},
		});

		return team;
	} catch (error) {
		console.error('Error in get team by id:', error);
		throw error;
	}
};

export const getTeamByEventId = async (eventId: number) => {
	try {
		const team = await prisma.teams.findMany({
			where: {
				event_id: eventId,
			},
		});

		return team;
	} catch (error) {
		console.error('Error in get team by event id:', error);
		throw error;
	}
};

export const createTeam = async ({ name, description, event_id, avatar_name }: CreateTeam) => {
	try {
		await prisma.teams.create({
			data: {
				name,
				description,
				event_id: event_id,
				avatar_name: avatar_name,
			},
		});
		console.log('Team created');
	} catch (error: any) {
		console.error('Error in create team:', error);
		throw error;
	}
};

export const updateTeam = async (teamId: number, data: UpdateTeam) => {
	try {
		const { name, description, event_id } = data;
		await prisma.teams.update({
			where: { id: teamId },
			data: {
				name,
				description,
				event_id,
			},
		});
	} catch (error) {
		console.error('Error in update team:', error);
		throw error;
	}
};

export const deleteTeam = async (id: number) => {
	try {
		await prisma.teams.delete({
			where: { id },
		});
	} catch (error) {
		console.error('Error in delete team:', error);
		throw error;
	}
};

export const updateTeamAvatarByTeamId = async (avatarName: string, teamId: number) => {
	try {
		await prisma.teams.update({
			where: {
				id: teamId,
			},
			data: {
				avatar_name: avatarName,
			},
		});
	} catch (error) {
		console.error('Error in update avatar team:', error);
		throw error;
	}
};

/**
 * Simply return event id
 * @param teamId Id of the team
 * @returns Event Id number of the event this team participate
 */
export const getEventIdByTeamId = async (teamId: number): Promise<{ event_id: number } | null> => {
	const query = 'SELECT event_id FROM teams WHERE id = ?';
	const result = await queryDB(query, [teamId]);
	return result.length > 0 ? result[0] : null;
};
