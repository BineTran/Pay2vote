"use client";
import React, { memo } from "react";
import { EventCardWrapper } from "../EventCardWrapper";
import { toast } from "react-toastify";
import useDataSWR from "@/hooks/useDataSWR";
import { Event } from "@/components";
import { ListEventSkeleton } from "./ListEventSkeleton";

export const ListEvents = memo(function ListEvents({ url }: { url: string }) {
	const { data: events, isLoading, isError } = useDataSWR(url);

	if (isError) {
		toast.error(`${isError}`);
		return <></>;
	}

	return isLoading ? (
		<ListEventSkeleton count={2} />
	) : (
		events &&
			events.map((event: Event, index: number) => (
				<EventCardWrapper
					key={index}
					eventID={event.id}
					eventName={event.name}
					eventAvatarPath={event.avatar_path}
				/>
			))
	);
});
