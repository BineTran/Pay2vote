import React, { memo } from "react";
import Link from "next/link";
import { ListTeams } from "./ListTeams";
import { Suspense } from "react";
import { ListTeamsSkeleton } from "./ListTeamsSkeleton";
import { NameEvent } from "./NameEvent";
import { VotePrice } from "./VotePrice";
import { Skeleton } from "../ui/Skeleton";

export const VoteButton = memo(function VoteButton({ eventID }: { eventID: number }) {
	return (
		<Link href={`/event/${eventID}/vote`}>
			<button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 shadow-md shadow-pink-500/50 z-30">
				<span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
					VOTE
				</span>
			</button>
		</Link>
	);
});

export const ListTeamsLayout = memo(function ListTeamsLayout({ eventID }: { eventID: number }) {
	return (
		<div className="flex flex-col min-h-[80vh]">
			<div className="flex items-center mb-5 flex-col">
				<div className="text-4xl text-black font-extrabold backdrop-blur-lg p-4 mt-4">
					<Suspense fallback={<Skeleton count={1} height="h-12" width="w-24" />}>
						<NameEvent eventID={eventID} />
					</Suspense>
				</div>
			</div>
			<div className="grid grid-cols-5 gap-6 w-full p-4">
				<Suspense fallback={<ListTeamsSkeleton />}>
					<ListTeams eventID={eventID} />
				</Suspense>
			</div>
			<div className="flex items-center m-5 flex-col">
				<VoteButton eventID={eventID} />
			</div>
			<div className="w-full flex justify-center">
				<VotePrice eventID={eventID}></VotePrice>
			</div>
		</div>
	);
});
