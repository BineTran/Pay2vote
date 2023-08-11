"use client";
import React from "react";
import { Team, TeamPoints } from "..";
import QRImage from "./QRImage";
import Avatar from "../Avatar";
import "../ui/BlazingFire.css";

type AvaQrPointItemsType = {
	index: number;
	team: Team;
	check: boolean;
	teamsPoints: TeamPoints[] | null;
	eventID: number;
	teamNameActive: string | null;
};

export default function AvaQrPointItems({
	index,
	team,
	check,
	teamsPoints,
	eventID,
	teamNameActive,
}: AvaQrPointItemsType) {
	const activeIndex = teamNameActive && teamNameActive === team.teamName ? index : -1;
	const active = teamNameActive === team.teamName ? true : false;
	const activeStyle = active ? "fire-box" : "";
	return (
		<div className="flex flex-wrap w-[25vw] h-full items-center justify-center mx-auto">
			<div className="  pt-10 pb-6 h-full w-full">
				<span className="relative transition-all ease-in duration-75 bg-white rounded-lg group-hover:bg-opacity-0">
					<div key={index} className={`flex flex-col  bg-white rounded-lg items-center ${activeStyle} `}>
						<div className="rounded-lg overflow-hidden">
							<div className="flex flex-row  h-full w-[25vw]">
								<Avatar
									urlAvatar={team.urlAvatar}
									teamName={team.teamName}
									eventID={eventID}
									teamID={team.teamID}
									check={check}
									teamPoints={teamsPoints}
									index={index}
									activeIndex={activeIndex}
								/>
							</div>

							{check && (
								<div className="w-[25vw]">
									<QRImage team={team} />
								</div>
							)}
						</div>
					</div>
				</span>
			</div>
		</div>
	);
}
