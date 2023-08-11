"use client";
import { EventContextProvider } from "@/context/EventContext";
import React from "react";
import { EventPicker } from "../teams/EventPicker";
import { ShowTable } from "./ShowTransactions";

export const TransactionHistory = () => {
	return (
		<>
			<EventContextProvider>
				<div className="flex flex-col gap-5 p-4">
					<EventPicker />
					<ShowTable />
				</div>
			</EventContextProvider>
		</>
	);
};
