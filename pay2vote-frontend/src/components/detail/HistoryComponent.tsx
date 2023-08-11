/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { TableAG } from "./table/TableAG";

// oi
export default function HistoryComponent({ teamID }: { teamID: number }) {
	return (
		<div className="max-w-screen-xl border border-favoriteGray/50 shadow-md rounded-md">
			<div className="relative overflow-hidden">
				<TableAG teamID={teamID}></TableAG>
			</div>
		</div>
	);
}
