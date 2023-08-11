import { ListTeamsLayout } from "@/components/team/ListTeamsLayout";
import React from "react";
import Background from "@/components/ui/Background";
import Navbar from "@/components/nav/Navbar";
import Popup from "@/components/utils/Popup";

export default function EventPage({ params }: { params: { eventId: string } }) {
	const eventId = parseInt(params.eventId, 10);
	return (
		<>
			<main className="">
				<Popup />
				<Navbar />
				<ListTeamsLayout eventID={eventId} />
				<Background />
			</main>
		</>
	);
}
