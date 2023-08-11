import React from "react";
import { typeDataTeam } from "../utils/ChartSupport";
import { DetailAvatar } from "./DetailAvatar";
import DetailDescription from "./DetailDescription";
import { VoteButton } from "../team/ListTeamsLayout";
import { GradientText } from "../ui/GradientText";

type DetailInformationProps = {
	eventId: number;
	currentTeam: typeDataTeam | null;
};

export const DetailInformation = React.forwardRef<HTMLDivElement, DetailInformationProps>(
	({ eventId, currentTeam }, ref) => {
		return (
			<div ref={ref} className="flex flex-col w-full min-h-[100vh] justify-center">
				<div className="flex flex-row order-1 w-full min-h-[50vh] justify-center items-center gap-4 md:p-12 sm:p-8 bg-white">
					{/* Main content  */}
					<div className="flex flex-col w-full h-full gap-0.5 bg-gradient-to-r from-purple-500/50 to-pink-500/50">
						{/* Main Title for this page  */}
						<div className="flex flex-col gap-1 bg-white pb-10">
							<div className="text-center text-gray-400 tracking-tighter text-md">
								TALENTED DEVELOPER BEHIND THIS PROJECT
							</div>
							<div className="flex justify-center items-center">
								<GradientText position="px-6 text-center">OUR TEAM</GradientText>
							</div>
						</div>

						{/* Avatar and description below  */}
						{currentTeam && (
							<div className="flex flex-row w-full h-[50vh] justify-between gap-0.5">
								{/* Left side avatar  */}
								<div className="flex w-1/2 h-full justify-center items-center bg-white">
									<DetailAvatar eventId={eventId} team={currentTeam} />
								</div>

								{/* Right side information  */}
								<div className="flex w-1/2 h-full justify-center items-center bg-white">
									<DetailDescription team={currentTeam} />
								</div>
							</div>
						)}
						<div className="flex items-center flex-col bg-white pt-10">
							<VoteButton eventID={eventId} />
						</div>
					</div>
				</div>
			</div>
		);
	},
);

DetailInformation.displayName = "DetailInformation";
