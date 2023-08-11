"use client";

import Avatar from "../Avatar";
import useDataSWR from "@/hooks/useDataSWR";
import { toast } from "react-toastify";
import { ListTeamsSkeleton } from "./ListTeamsSkeleton";
import { memo } from "react";
import { config } from "@/utils/config";

type ListTeamsProps = {
	eventID: number;
	customText?: string;
};
export const ListTeams = memo(function ListTeams({ eventID, customText }: ListTeamsProps) {
	const { data, isLoading, isError } = useDataSWR(`${config.apiRoute.GET_ALL_QR_OF_EVENT}/${eventID}`);
	if (isError) {
		toast.error(`${isError}`);
	}

	return isLoading ? (
		<ListTeamsSkeleton />
	) : (
		data.map((team: any, index: number) => (
			<Avatar
				key={index}
				urlAvatar={team.urlAvatar}
				teamName={team.teamName}
				eventID={team.eventID}
				teamID={team.teamID}
				customText={customText}
			/>
		))
	);
});
