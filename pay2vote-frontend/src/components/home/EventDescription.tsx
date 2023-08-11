import React from "react";
import { AvatarHolder } from "../nav/AvatarHolder";
import { FC } from "react";
import useDataSWR from "@/hooks/useDataSWR";
import { toast } from "react-toastify";
import { EventCardLayout } from "./EventCardLayout";
import { TeamQR } from "..";
import { config } from "@/utils/config";

type GetTeamQRResponse = {
	data: TeamQR[];
	isLoading: boolean;
	isError: boolean;
};

interface EventDescriptionProps {
	eventName: string;
	eventID: number;
}

export const EventDescription: FC<EventDescriptionProps> = React.memo(function EventDescription({
	eventName,
	eventID,
}) {
	// Get team qr by event id
	const {
		data: teamsQR,
		isLoading,
		isError,
	}: GetTeamQRResponse = useDataSWR(`${config.apiRoute.GET_ALL_QR_OF_EVENT}/${eventID}`);

	if (isError) {
		toast.error(`${isError}`);
	}

	return (
		<EventCardLayout.Description eventName={!isLoading ? eventName : <EventCardLayout.EventNameSkeleton />}>
			{!isLoading ? (
				teamsQR && teamsQR.length > 0 ? (
					teamsQR.map((item: TeamQR, index: any) => (
						<AvatarHolder
							key={index}
							imageUrl={item.urlAvatar}
							altText=""
							className=""
							showPlaceholder={item.urlAvatar ? false : true}
							teamName={item.teamName}
						/>
					))
				) : (
					<div className="flex w-full h-12 items-center px-2">
						<p className="text-gray-400 text-sm">No team participated</p>
					</div>
				)
			) : (
				<EventCardLayout.TeamAvatarListSkeleton />
			)}
		</EventCardLayout.Description>
	);
});
