import { AppError } from '@/errors';
import { getEventById } from '@/models/eventsModel';
import { getAccountByUserId } from '@/models/fiServiceAccountModel';
import { getTeamByEventId } from '@/models/teamsModel';
import { Request, Response, NextFunction } from 'express';

interface TeamQR {
	url: string;
	teamName: string;
	urlAvatar: string | null;
	eventID: number;
	teamID: number;
}

// interface dataTeamDB {
// 	id: number;
// 	name: string;
// 	description: string;
// 	avatar_name: string;
// 	event_id: string;
// 	created_at: string;
// 	updated_at: string;
// }

export const getUrlEventCon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const eventID = parseInt(req.params.eventID, 10);
		const dataTeam = await getTeamByEventId(eventID);

		const event = await getEventById(eventID);
		if (!event) {
			throw new AppError(404, 'Event not found');
		}
		const dataFiService: any = await getAccountByUserId(event.user_id);

		const bankID = dataFiService.bin;
		const accountNO = dataFiService.account_number;
		const template = 'qr_only';
		const accountName = dataFiService.account_name;

		const teams: TeamQR[] = dataTeam.map((element: any) => {
			const description = `CASV${element.id}CASV Donate for ${element.name}`;
			const url = `https://img.vietqr.io/image/${bankID}-${accountNO}-${template}.png?addInfo=${description}&accountName=${accountName}`;
			const teamName = element.name;
			const urlAvatar = element.avatar_name ? `${process.env.SERVER_DOMAIN}/${element.avatar_name}` : '';
			const teamID = element.id;
			return { url, teamName, urlAvatar, eventID, teamID };
		});
		res.status(200).json(teams);
	} catch (error: any) {
		next(error);
	}
};
