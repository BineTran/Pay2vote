import React from "react";
import { EventCardLayout } from "./EventCardLayout";

type ListEventSkeletonProps = {
	count?: number;
};

export const ListEventSkeleton = ({ count = 3 }: ListEventSkeletonProps) => {
	return Array.from({ length: count }).map((_, index) => (
		<div key={index}>
			<EventCardLayout>
				<EventCardLayout.Avatar showSkeleton={true}>
					<EventCardLayout.AvatarSkeleton />
				</EventCardLayout.Avatar>
				<EventCardLayout.Description eventName={<EventCardLayout.EventNameSkeleton />}>
					<EventCardLayout.TeamAvatarListSkeleton />
				</EventCardLayout.Description>
			</EventCardLayout>
		</div>
	));
};
