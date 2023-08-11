import { EventCombobox } from "@/components/nav/EventCombobox";
import React from "react";
import { Event } from "@/components";
import { useCallback } from "react";
import { useEventContext } from "@/hooks/useEventContext";

export const EventComboboxWrapper = () => {
	const { eventId, attemptedOpen, setEventId, setIsShowInvalidTrans, setColumnDefs } = useEventContext();

	const handleSelection = useCallback(
		(value: Event) => {
			setEventId(value.id);
			setIsShowInvalidTrans(false);
			setColumnDefs([
				{ headerName: "Order", field: "ID", sortable: true, resizable: true, flex: 0.65 },
				{ headerName: "Team ID", field: "team_id", resizable: true, sortable: true, flex: 0.75 },
				{
					headerName: "Datetime",
					field: "transaction_datetime",
					resizable: true,
					flex: 1,
				},
				{
					headerName: "Bank ID",
					field: "counter_account_bank_id",
					sortable: true,
					resizable: true,
					flex: 0.7,
				},
				{
					headerName: "Account Number",
					field: "counter_account_number",
					sortable: true,
					resizable: true,
					flex: 1.4,
				},
				{
					headerName: "Account Name",
					field: "counter_account_name",
					sortable: true,
					resizable: true,
					flex: 1.4,
					filter: true,
				},
				{
					headerName: "Amount",
					field: "amount",
					sortable: true,
					resizable: true,
					flex: 0.8,
				},
				{
					headerName: "Status",
					field: "transaction_status",
					sortable: true,
					resizable: true,
					flex: 1.2,
					filter: true,
					cellStyle: function (params: any) {
						if (params.data.transaction_status === "Pending") {
							return { color: "#d39f00" };
						}
						if (params.data.transaction_status === "Nonrefundable") {
							return { color: "#919090" };
						}
						if (params.data.transaction_status === "Refunding") {
							return { color: "#38BDF8" };
						}
						return { color: "green" };
					},
				},
			]);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[setEventId, setIsShowInvalidTrans],
	);

	const errorBorder = !eventId && attemptedOpen ? "border border-red-600" : "";

	return (
		<div className="relative">
			<EventCombobox
				handleSelection={handleSelection}
				className={`${errorBorder}`}
				url={`${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/event/getallforad`}
			/>
			{!eventId && attemptedOpen && (
				<p className="text-red-500 font-normal italic absolute ">Please select an event.</p>
			)}
		</div>
	);
};
