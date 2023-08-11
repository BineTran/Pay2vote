"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import HistoryComponent from "@/components/detail/HistoryComponent";
import ChartComponent from "@/components/detail/chart/ChartComponent";
import { toast } from "react-toastify";
import LoadingScreenSpinner from "../ui/LoadingScreenSpinner";
import { redirect } from "next/navigation";
import useDataSWR from "@/hooks/useDataSWR";
import { typeDataTeam } from "../utils/ChartSupport";
import { DetailInformation } from "./DetailInformation";

type DetailContentProps = {
	eventId: number;
	teamId: number;
};

export default function DetailContent({ eventId, teamId }: DetailContentProps) {
	// Get a team data
	const { data, isLoading, isError } = useDataSWR(
		`${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/team/eventId/${eventId}`,
	);
	if (isError) {
		toast.error(isError);
	}

	const [currentTeam, setCurrentTeam] = useState<typeDataTeam | null>(null);

	// Find team and set its avatar
	useEffect(() => {
		if (!isLoading) {
			let team = data.find((team: typeDataTeam) => team.id === teamId);
			team = {
				...team,
				avatar_name: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/${team.avatar_name}`,
			};
			setCurrentTeam(team);
		}
	}, [data, isLoading, teamId]);

	// Check for 404 if user enter wrong url
	useLayoutEffect(() => {
		if (!isLoading && data) {
			const teamExists = data.some((team: any) => team.id === teamId);
			if (!teamExists) {
				redirect("/404");
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, data, teamId]);

	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isLoading) {
			setTimeout(() => {
				scrollRef.current?.scrollIntoView({ behavior: "smooth" });
			}, 200); // adjust the delay time as needed
		}
	}, [isLoading]);

	return !isLoading ? (
		<div className="flex flex-col order-2 w-3/4">
			{/* Detail team container  */}
			<DetailInformation ref={scrollRef} eventId={eventId} currentTeam={currentTeam} />

			{/* Chart components for each team */}
			<div className="flex order-2 w-full items-center justify-center pb-10">
				<ChartComponent eventID={eventId} allTeams={data} />
			</div>

			{/* Transaction history for each team */}
			<div className="order-3 w-full bg-white/90 border border-favoriteGray/50 shadow-lg rounded-lg p-3 sm:p-5 mb-10">
				<HistoryComponent teamID={teamId}></HistoryComponent>
			</div>
		</div>
	) : (
		<>
			<div className="z-40">
				<LoadingScreenSpinner />
			</div>
		</>
	);
}
