"use client";
import React from "react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import CloseButton from "./CloseButton";
import SwiperCompo from "./SwiperCompo";
import { TeamPoints } from "..";
import { toast } from "react-toastify";
import useDataSWR from "@/hooks/useDataSWR";
import { Skeleton } from "../ui/Skeleton";
import { config } from "@/utils/config";
import { RefreshVoteButton } from "./RefreshVoteButton";

export default function VoteItem({ check, eventID }: { check: boolean; eventID: number }) {
	const [teamNameActive, setTeamNameActive] = useState(null);
	const arrayToastId: any = [];
	const inforDonate: string[] = [];
	const [teamsPoints, setTeamsPoints] = useState<Array<TeamPoints> | null>(null);
	const [isMounted, setIsMounted] = useState(false);

	const { data, isLoading, isError } = useDataSWR(
		`${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/qr/getAllEvent/${eventID}`,
	);
	if (isError) {
		toast.error(`${isError}`);
	}

	useEffect(() => {
		window.addEventListener("popstate", () => {});

		return () => {
			toast.dismiss(); // Debugging statement
			window.removeEventListener("popstate", () => {});
		};
	}, []);

	useEffect(() => {
		setIsMounted(true);

		const newSocket = io(config.development ? "http://localhost:5001" : config.serverDomain, {
			path: config.socketServerPath,
		});

		newSocket.on("connect", () => {
			newSocket.emit("join", `${eventID}`);
			newSocket.emit("fetchPoints", `${eventID}`);
		});

		// Listen for the error event from the server
		newSocket.on("error", (errorMessage) => {
			// Handle the error here. For example, show it in an alert box or log it.
			console.error(errorMessage);
		});

		// Listen for team_points event from server, which is the team's point of all team
		newSocket.on("teams_points", (teamsPoints: any) => {
			setTeamsPoints(teamsPoints.teamsPoints);
		});

		newSocket.on("new_vote", (message) => {
			if (message.status === "valid") {
				setTeamNameActive(message.teamName);
				arrayToastId.push(toast.success(message.name, { position: "top-left", autoClose: false }));
			} else {
				arrayToastId.push(toast.error(message.name, { position: "top-left", autoClose: false }));
			}
			const newInfo: string = message.name;
			inforDonate.push(newInfo);
			if (inforDonate.length > 3) {
				inforDonate.shift();
				toast.dismiss(arrayToastId[0]);
				arrayToastId.shift();
			}
		});

		return () => {
			newSocket.emit("leave", `${eventID}`);
			newSocket.close();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventID]);

	return isLoading ? (
		Array.from({ length: 6 }).map((_, index) => (
			<div key={index}>
				<Skeleton></Skeleton>
			</div>
		))
	) : (
		<div className="h-screen">
			{
				<div className="fixed top-0 right-0 m-4 z-50">
					<div className="flex flex-row gap-4">
						<RefreshVoteButton eventId={eventID} />
						<CloseButton />
					</div>
				</div>
			}
			{isMounted && (
				<div className="flex flex-row flex-nowrap justify-center items-center h-screen  ">
					<SwiperCompo
						allTeam={data}
						check={check}
						teamsPoints={teamsPoints}
						eventID={eventID}
						teamNameActive={teamNameActive}
					/>
				</div>
			)}
		</div>
	);
}
