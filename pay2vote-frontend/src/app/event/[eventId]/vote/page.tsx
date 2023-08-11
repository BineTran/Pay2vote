import React from "react";
import VoteItem from "@/components/vote/VoteItems";

export default function Home({ params }: { params: { eventId: string } }) {
	const eventID = parseInt(params.eventId, 10);
	return (
		<div>
			<VoteItem check={true} eventID={eventID}></VoteItem>
		</div>
	);
}
