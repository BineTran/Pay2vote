import React from "react";
import { HomepageLayout } from "./HomepageLayout";
import { ListEvents } from "./ListEvents";
import { config } from "@/utils/config";

export const HomepageContainer = () => {
	return (
		<HomepageLayout>
			<HomepageLayout.Title>Events</HomepageLayout.Title>
			<HomepageLayout.ListEventContainer>
				<ListEvents url={config.apiRoute.GET_ALL_EVENTS_API} />
			</HomepageLayout.ListEventContainer>
		</HomepageLayout>
	);
};
