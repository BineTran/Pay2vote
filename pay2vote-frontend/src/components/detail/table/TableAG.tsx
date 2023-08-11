import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import useDataSWR from "@/hooks/useDataSWR";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { config } from "@/utils/config";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/Skeleton";
import "./style.css";

export const TableAG = ({ teamID }: { teamID: number }) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [columnDefs, setColumnDefs] = useState([
		{ headerName: "ID", field: "ID", resizable: true },
		{ headerName: "Name", field: "name", resizable: true },
		{ headerName: "Transaction Datetime", field: "transaction_datetime", sortable: true, resizable: true, flex: 2 },
		{ headerName: "Counter Account Name", field: "counter_account_name", sortable: true, resizable: true, flex: 2 },
		{
			headerName: "Amount",
			field: "amount",
			sortable: true,
			resizable: true,
			flex: 1,
			cellStyle: { color: "green" },
		},
	]);

	const { data, isLoading, isError } = useDataSWR(`${config.serverDomain}/api/v1/transaction/teamID/valid/${teamID}`);
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
			/>
		</div>
	);
};
