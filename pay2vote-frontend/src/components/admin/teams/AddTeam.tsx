"use client";
import React, { Suspense, memo, useCallback, useState } from "react";
import { DialogWrapper } from "./DialogWrapper";
import { AddTeamForm } from "./AddTeamForm";
import { SettingSection } from "../utils/SettingSection";
import { PropsWithChildren } from "react";
import { useEventContext } from "@/hooks/useEventContext";
import { ListTeams } from "@/components/team/ListTeams";
import { SpecialAddButton } from "../utils/SpecialAddButton";
import { ListTeamsSkeleton } from "@/components/team/ListTeamsSkeleton";

const TeamAspectBox = ({ children }: PropsWithChildren) => {
	return <div className="h-full min-h-[10rem]">{children}</div>;
};

export const AddTeamAndDialog = memo(function AddTeamAndDialog() {
	const [isOpen, setIsOpen] = useState(false);
	const { eventId, setAttemptedOpen } = useEventContext();

	const openModal = useCallback(() => {
		if (eventId) {
			setIsOpen(true);
		} else {
			setAttemptedOpen(true);
		}
	}, [eventId, setAttemptedOpen]);

	const CloseModal = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<>
			<SettingSection>
				<SettingSection.Header>Teams</SettingSection.Header>

				<div className="grid grid-cols-4 gap-4 items-center justify-start">
					{/* Add team button  */}
					<TeamAspectBox>
						<SpecialAddButton openModal={openModal}>Add team</SpecialAddButton>
					</TeamAspectBox>

					{/* List teams of event chosen  */}
					<Suspense fallback={<ListTeamsSkeleton customText="h-7" />}>
						{eventId && <ListTeams eventID={eventId} customText={"text-lg lg:text-lg"} />}
					</Suspense>
				</div>
			</SettingSection>

			{/* Modal popup when click add team  */}
			<DialogWrapper
				isOpen={isOpen}
				setIsOpen={CloseModal}
				title={"Add team"}
				description="You can add a team here."
			>
				<AddTeamForm title={"Add team"} onTeamCreated={CloseModal} />
			</DialogWrapper>
		</>
	);
});
