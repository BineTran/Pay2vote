"use client";
import React, { createContext, useState } from "react";

interface EventContextProps {
	eventId: number | null;
	setEventId: React.Dispatch<React.SetStateAction<number | null>>;
	attemptedOpen: boolean;
	setAttemptedOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isShowInvalidTrans: boolean;
	setIsShowInvalidTrans: React.Dispatch<React.SetStateAction<boolean>>;
	columnDefs: any;
	setColumnDefs: React.Dispatch<React.SetStateAction<any>>;
	spinnerAll: boolean;
	setSpinnerAll: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EventContext = createContext<EventContextProps | undefined>(undefined);

export const EventContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [spinnerAll, setSpinnerAll] = useState(false);
	const [eventId, setEventId] = useState<number | null>(null);
	const [attemptedOpen, setAttemptedOpen] = useState<boolean>(false);
	const [isShowInvalidTrans, setIsShowInvalidTrans] = useState(false);
	const [columnDefs, setColumnDefs] = useState([
		{ headerName: "Order", field: "ID", sortable: true, resizable: true, flex: 0.6 },
		{ headerName: "Team ID", field: "team_id", resizable: true, sortable: true, flex: 0.7 },
		{
			headerName: "Datetime",
			field: "transaction_datetime",
			sortable: true,
			resizable: true,
			flex: 1.4,
		},
		{
			headerName: "Bank ID",
			field: "counter_account_bank_id",
			sortable: true,
			resizable: true,
			flex: 1,
		},
		{
			headerName: "Account Number",
			field: "counter_account_number",
			sortable: true,
			resizable: true,
			flex: 1,
		},
		{
			headerName: "Account Name",
			field: "counter_account_name",
			sortable: true,
			resizable: true,
			flex: 1.8,
			filter: true,
		},
		{
			headerName: "Amount",
			field: "amount",
			sortable: true,
			resizable: true,
			flex: 0.8,
			cellStyle: { color: "green" },
		},
		{
			headerName: "Status",
			field: "transaction_status",
			sortable: true,
			resizable: true,
			flex: 1.2,
			filter: true,
			cellStyle: { color: "green" },
		},
	]);
	const value = {
		eventId,
		setEventId,
		attemptedOpen,
		setAttemptedOpen,
		isShowInvalidTrans,
		setIsShowInvalidTrans,
		columnDefs,
		setColumnDefs,
		spinnerAll,
		setSpinnerAll,
	};
	return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
