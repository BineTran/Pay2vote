import React, { ReactNode } from "react";
import { Skeleton } from "../ui/Skeleton";

type AvatarCardLayout = {
	avatarImage: ReactNode;
	teamPoints?: ReactNode;
	teamName: ReactNode;
	customText?: string;
};

const AvatarCardLayout = ({ avatarImage, teamName, teamPoints, customText }: AvatarCardLayout) => {
	return (
		<div className="h-full w-full bg-white gap-6 rounded-lg items-center border-1 border-gray-500/50 mx-auto shadow-md">
			{/* Team card  */}
			<div className="h-full w-full rounded-lg items-center flex flex-col justify-start">
				{/* Team image */}
				<div className="relative aspect-[4/3] w-full rounded-t-md overflow-hidden">{avatarImage}</div>

				{/* Team name  */}
				<div className="flex w-full justify-center py-2">
					<div className={`text-4xl lg:text-2xl md:text-2xl font-bold text-black ${customText}`}>
						{teamName}
					</div>
				</div>

				{teamPoints}
			</div>
		</div>
	);
};

type ListTeamsSkeletonProps = {
	customText?: string;
};

export const ListTeamsSkeleton = ({ customText }: ListTeamsSkeletonProps) => {
	return Array.from({ length: 5 }).map((_, index) => (
		<div key={index}>
			<AvatarCardLayout
				avatarImage={<Skeleton count={1} height="h-60" />}
				teamName={<Skeleton count={1} width="w-32" height={customText ? customText : "h-8"} />}
			/>
		</div>
	));
};
