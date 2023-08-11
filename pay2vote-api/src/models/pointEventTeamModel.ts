import { queryDB } from '../utils/db';

export const createPointModel = async (data: any) => {
	const query =
		'INSERT INTO point_event_team (point,  event_id,  team_id, created_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';
	await queryDB(query, [data.point, data.event_id, data.team_id]);
};

export const getFirstTransPointModel = async (data: any) => {
	const query = `
        SELECT created_at 
        FROM point_event_team
        WHERE event_id = ?
        ORDER BY created_at ASC
        LIMIT 1
    `;
	const result: any = await queryDB(query, [data.eventID]);
	return result;
};

export const getPointChartModel = async (data: any) => {
	const query = `
    SELECT *
    FROM point_event_team
    WHERE created_at <= ? AND event_id = ?
    ORDER BY created_at DESC , team_id ASC
    LIMIT ?
    `;
	const result = await queryDB(query, [data.time, data.eventID, data.limit]);
	return result;
};

export const getEventIDbyTeamIDModel = async (data: any) => {
	const query = `
    SELECT DISTINCT event_id 
    FROM teams
    INNER JOIN transactions ON transactions.team_id = teams.id
    WHERE team_id = ?
    `;
	const result = await queryDB(query, [data.teamID]);
	return result;
};
