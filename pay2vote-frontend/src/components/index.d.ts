export interface Team {
	url: string;
	teamName: string;
	urlAvatar: string;
	eventID: number;
	teamID: number;
}

export interface Event {
	id: number;
	name: string;
	user_id: number;
	description: string;
	avatar_path: string;
	created_at: string;
	updated_at: string;
}

export interface TeamPoints {
	team_id: number;
	points: number;
}

export interface QueryParams {
	team: Team;
}

export interface TeamQR {
	url: string;
	teamName: string;
	urlAvatar: string;
	eventID: number;
	teamID: number;
}
