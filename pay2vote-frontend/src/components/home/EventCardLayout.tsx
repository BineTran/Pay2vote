import React, { PropsWithChildren } from "react";
import Image from "next/image";
import { Skeleton } from "../ui/Skeleton";
import Avatar, { genConfig } from "react-nice-avatar";
import { GradientText } from "../ui/GradientText";

type EventCardLayoutCompoundType = React.FC<PropsWithChildren> & {
	Avatar: React.FC<EventAvatarProps>;
	Description: React.FC<EventDescriptionProps>;
	AvatarSkeleton: React.FC;
	EventNameSkeleton: React.FC;
	TeamAvatarListSkeleton: React.FC;
};

export const EventCardLayout: EventCardLayoutCompoundType = ({ children }: PropsWithChildren) => {
	return (
		<div className="flex h-full w-full">
			<div
				className="flex flex-col flex-nowrap w-full h-full min-h-[20vh]  mx-auto items-center justify-between
     bg-white border border-favoriteGray/50 rounded-md shadow-md"
			>
				<div className="w-full bg-gradient-to-r from-purple-500 to-pink-500  rounded-md hover:p-0.5 duration-200 transition-all">
					<div className="flex flex-col h-full w-full justify-between p-4 bg-white rounded-md">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};

type EventAvatarProps = {
	imageUrl?: string | null;
	children?: React.ReactNode;
	showSkeleton?: boolean;
	eventName?: string;
};

EventCardLayout.Avatar = function EventAvatar({
	imageUrl,
	children,
	showSkeleton = false,
	eventName,
}: EventAvatarProps) {
	const defaultImage = imageUrl ? "bg-white" : "bg-gray-200";

	return (
		<div className="flex flex-nowrap  w-full h-full justify-center items-center p-4">
			<div className={`w-3/4 aspect-square rounded-xl  relative ${defaultImage} overflow-hidden`}>
				{!showSkeleton ? (
					imageUrl ? (
						<Image
							src={imageUrl}
							fill={true}
							sizes="(max-width: 1200px) 8vw"
							alt="Event"
							className="rounded-xl"
						/>
					) : (
						<div className="flex flex-row w-full h-full z-0 relative ">
							<Avatar
								className={"w-5/6 h-5/6 absolute z-1 -left-10 bottom-0"}
								{...{ ...genConfig(eventName + "1"), shape: "rounded", bgColor: "none" }}
							/>
							<Avatar
								className={"w-5/6 h-5/6 absolute z-1 -right-10 bottom-0"}
								{...{ ...genConfig(eventName + "2"), shape: "rounded", bgColor: "none" }}
							/>
						</div>
					)
				) : (
					children
				)}
			</div>
		</div>
	);
};

type EventDescriptionProps = {
	eventName: React.ReactNode;
	children: React.ReactNode;
};
EventCardLayout.Description = function Description({ eventName, children }: EventDescriptionProps) {
	return (
		<div className="flex flex-col gap-4 w-full">
			{/* Event name  */}
			<div className="rounded-lg p-2 bg-white items-center justify-center ">
				<div className="flex flex-wrap w-full justify-start">
					<GradientText onlyHover textStyle="text-2xl font-semibold ">
						{eventName}
					</GradientText>
				</div>
			</div>

			{/* Event's teams avatar  */}
			<div className="flex flex-row justify-start -space-x-5">{children}</div>
		</div>
	);
};

EventCardLayout.AvatarSkeleton = function AvatarSkeleton() {
	return <Skeleton variant="card" width="w-full" height="h-full" />;
};

EventCardLayout.EventNameSkeleton = function EventNameSkeleton() {
	return <Skeleton width="w-36" height="h-8" />;
};

EventCardLayout.TeamAvatarListSkeleton = function TeamAvatarList() {
	return <Skeleton count={3} variant="image" width="w-12" height="h-12" />;
};
