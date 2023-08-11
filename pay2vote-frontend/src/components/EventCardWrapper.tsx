import React, { memo } from "react";
import Link from "next/link";
import { EventDescription } from "./home/EventDescription";
import { EventCardLayout } from "./home/EventCardLayout";
import { config } from "@/utils/config";

type EventCardWrapper = {
	eventID: number;
	eventName: string;
	eventAvatarPath: string;
};

export const EventCardWrapper = memo(function EventCardWrapper({
	eventID,
	eventName,
	eventAvatarPath,
}: EventCardWrapper) {
	// Null for placeholder taking place
	const imageUrl = eventAvatarPath ? `${config.serverDomain}/${eventAvatarPath}` : null;
	return (
		<Link href={`/event/${eventID}`}>
			<EventCardLayout>
				<EventCardLayout.Avatar imageUrl={imageUrl} eventName={eventName} />
				<EventDescription eventName={eventName} eventID={eventID} />
			</EventCardLayout>
		</Link>
	);
});
