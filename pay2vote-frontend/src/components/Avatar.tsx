import React from "react";
import Image from "next/image";
import Link from "next/link";
import { TeamPoints } from ".";
import Avatar, { genConfig } from "react-nice-avatar";
import { toast } from "react-toastify";

type AvatarType = {
	urlAvatar: string;
	teamName: string;
	eventID?: number | null;
	teamID?: number | null;
	teamPoints?: TeamPoints[] | null;
	check?: boolean;
	index?: number;
	customText?: string;
	onlyImage?: boolean;
	activeIndex?: number;
};

export default function TeamAvatar({
	urlAvatar,
	teamName,
	eventID,
	teamID,
	teamPoints,
	check,
	index,
	customText,
	onlyImage = false,
	activeIndex = -1,
}: AvatarType) {
	// Config for default avatar
	const config = genConfig(teamName);

	const activeText =
		index === activeIndex ? " bg-gradient-to-br from-purple-500 to-pink-500 text-transparent bg-clip-text" : "";

	const handleClick = () => {
		toast.dismiss();
	};
	return !onlyImage ? (
		<Link href={`/event/${eventID}/${teamID}`} className="h-full w-full" onClick={handleClick}>
			<div className="h-full w-full bg-white gap-6 rounded-lg items-center border-1 border-gray-500/50 mx-auto shadow-md">
				{/* Team card  */}
				<div className="h-full w-full rounded-lg items-center flex flex-col justify-start">
					{/* Team image */}
					<div className="relative aspect-[4/3] w-full rounded-t-md overflow-hidden">
						{urlAvatar !== "" ? (
							<Image
								src={urlAvatar}
								alt="Your Name"
								fill={true}
								sizes={"(max-width: 768px) 10vw"}
								priority
								className="absolute"
							/>
						) : (
							// <div className="w-full h-full bg-gray-200"></div>
							<Avatar
								{...{ ...config, shape: "square" }}
								className="w-full h-full rounded-none rounded-t-md"
							/>
						)}
					</div>
					{/* Team name  */}
					<div className="flex w-full justify-center py-2">
						<div
							className={`text-4xl lg:text-2xl md:text-2xl font-bold text-black ${customText} ${activeText}`}
						>
							{teamName}
						</div>
					</div>

					{teamPoints != (null && undefined) && check && typeof index === "number" && (
						<div
							className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden 
							text-sm font-medium text-gray-900 rounded-lg 
							group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 
							hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 
							shadow-md shadow-pink-500/50"
						>
							<span className="relative px-4 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
								<div className="text-xl font-semibold text-center">{teamPoints[index].points}</div>
							</span>
						</div>
					)}
				</div>
			</div>
		</Link>
	) : (
		<div className="relative aspect-[4/3] w-full overflow-hidden">
			{urlAvatar !== "" ? (
				<Image
					src={urlAvatar}
					alt="Your Name"
					fill={true}
					sizes={"(max-width: 768px) 10vw"}
					priority
					className="absolute"
				/>
			) : (
				// <div className="w-full h-full bg-gray-200"></div>
				<Avatar {...{ ...config, shape: "square" }} className="w-full h-full rounded-none" />
			)}
		</div>
	);
}
