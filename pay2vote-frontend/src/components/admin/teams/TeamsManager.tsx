"use client";
import React, { memo } from "react";
import { AddTeamAndDialog } from "./AddTeam";
import { EventPicker } from "./EventPicker";
import { EventContextProvider } from "@/context/EventContext";

export const TeamsManager = memo(function TeamsManager() {
	return (
		<>
			<EventContextProvider>
				<div className="flex flex-col gap-5 p-4">
					<EventPicker />
					<AddTeamAndDialog />
				</div>
			</EventContextProvider>
		</>
	);
});
