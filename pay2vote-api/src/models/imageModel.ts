import { queryDB } from '../utils/db';

export const saveImagePathToTeam = async (avatarName: string, userId: number) => {
	const sql = 'UPDATE teams SET avatar_name = ? WHERE id = ?';
	await queryDB(sql, [avatarName, userId]);
};

export const saveImagePathToEvent = async (avatarPath: string, userId: number) => {
	const sql = 'UPDATE events SET avatar_path = ? WHERE id = ?';
	await queryDB(sql, [avatarPath, userId]);
};
