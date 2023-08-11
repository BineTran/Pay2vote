"use client";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { config } from "@/utils/config";
import { toast } from "react-toastify";
import useDataSWR from "@/hooks/useDataSWR";
import { Skeleton } from "@/components/ui/Skeleton";
import { DialogTransition } from "./DialogRefund";
import { useEventContext } from "@/hooks/useEventContext";
import "./style.css";

type TableTransProps = {
	setIsTableLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export function closeModal(setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) {
	setIsOpen(false);
}

export function openModal(setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) {
	setIsOpen(true);
}

export const TableTrans = ({ setIsTableLoading }: TableTransProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [url, setUrl] = useState("");
	const [id, setID] = useState(-1);

	const { eventId, isShowInvalidTrans, columnDefs } = useEventContext();

	const invalidTableURL = `${config.apiRoute.GET_INVALID_TRANSACTIONS_BY_EVENT_ID}/${eventId}`;
	const validTableURL = `${config.apiRoute.GET_VALID_TRANSACTIONS_BY_EVENT_ID}/${eventId}`;

	const urlForTable = isShowInvalidTrans ? invalidTableURL : validTableURL;
	const { data, isLoading, isError } = useDataSWR(urlForTable, eventId);

	useEffect(() => {
		setIsTableLoading(isLoading);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading]);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars

	if (isError) {
		toast.error(`${isError}`);
	}

	return isLoading ? (
		<Skeleton />
	) : (
		<div className="ag-theme-alpine w-full" style={{ height: 600, width: "100%" }}>
			<AgGridReact
				rowData={data}
				columnDefs={columnDefs}
				animateRows={true}
				rowSelection="multiple"
				pagination={true}
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				onCellClicked={(event: any) => {
					if (event.event && event.event.detail === 2 && isShowInvalidTrans) {
						setID(event.data.id);
						if (event.data.transaction_status === "Completed") {
							toast.warning("This transaction was refunded");
						} else if (event.data.transaction_status === "Nonrefundable") {
							toast.warning("Sorry, but this transaction is nonrefundable.");
						} else if (event.data.transaction_status === "Refunding") {
							toast.warning("This transaction is in the process of being refunded.");
						} else {
							const url = `${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/refund/selected/${
								event.data.id
							}`;
							setUrl(url);
							openModal(setIsOpen);
						}
					}
				}}
			/>
			{isShowInvalidTrans ? <DialogTransition isOpen={isOpen} setIsOpen={setIsOpen} url={url} id={id} /> : null}
		</div>
	);
};
