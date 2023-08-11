import React from "react";
import Avatar from "../Avatar";
import { typeDataTeam } from "../utils/ChartSupport";

type DetailAvatarProps = {
	eventId: number;
	team: typeDataTeam | null;
};

export function DetailAvatar({ eventId, team }: DetailAvatarProps) {
	return (
		team && (
			<div className="w-2/3 ">
				<Avatar
					urlAvatar={team.avatar_name}
					teamName={team.name}
					eventID={eventId}
					teamID={team.id}
					onlyImage={true}
				/>
			</div>
		)
	);
}
