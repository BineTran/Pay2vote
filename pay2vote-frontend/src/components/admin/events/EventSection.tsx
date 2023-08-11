"use client";
import { ListEvents } from "@/components/home/ListEvents";
import React, { Suspense, useState } from "react";
import { SettingSection } from "../utils/SettingSection";
import { SpecialAddButton } from "../utils/SpecialAddButton";
import { PropsWithChildren } from "react";
import { DialogWrapper } from "../teams/DialogWrapper";
import { EventForm } from "./EventForm";
import { config } from "@/utils/config";

const EventAspectBox = ({ children }: PropsWithChildren) => {
	return <div className="h-full min-h-[10rem]">{children}</div>;
};

export const EventSection = () => {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	return (
		<>
			<SettingSection>
				<SettingSection.Header>Your events</SettingSection.Header>
				<div className="grid grid-cols-3 gap-4">
					{/* Add event button  */}
					<EventAspectBox>
						<SpecialAddButton openModal={openModal}>Add event</SpecialAddButton>
					</EventAspectBox>

					<Suspense fallback={<></>}>
						<ListEvents url={config.apiRoute.GET_EVENTS_OF_USER} />
					</Suspense>
				</div>
			</SettingSection>
			{/* Dialog popup to add event */}
			<DialogWrapper
				isOpen={isOpen}
				setIsOpen={closeModal}
				title="Add event"
				description="You can add an event here."
			>
				<EventForm onEventCreated={closeModal} />
			</DialogWrapper>
		</>
	);
};
