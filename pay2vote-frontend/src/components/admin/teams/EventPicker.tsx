import React, { useEffect, useState } from "react";
import { SettingSection } from "../utils/SettingSection";
import { EventComboboxWrapper } from "./EventComboboxWrapper";
import { usePathname } from "next/navigation";
import { useEventContext } from "@/hooks/useEventContext";
import DialogRefundAll from "../transactions/DialogRefundAll";
import Spinner from "@/components/ui/Spinner";
import { fetchJSON } from "@/utils/requestJSON";

export const EventPicker = () => {
	const { setIsShowInvalidTrans, setColumnDefs, eventId, isShowInvalidTrans, spinnerAll, setSpinnerAll } =
		useEventContext();
	const pathname = usePathname();
	const [isOpen, setIsOpen] = useState(false);
	const [isDisable, setIsDisable] = useState(true);
	const handleClick = () => {
		setIsShowInvalidTrans(true);
		setColumnDefs([
			{
				headerName: "Order",
				field: "ID",
				sortable: true,
				resizable: true,
				flex: 0.6,
				cellStyle: function (params: any) {
					if (params.data.transaction_status === "Nonrefundable") {
						return { color: "#919090" };
					}
				},
			},
			{
				headerName: "Datetime",
				field: "transaction_datetime",
				sortable: true,
				resizable: true,
				flex: 1.4,
				cellStyle: function (params: any) {
					if (params.data.transaction_status === "Nonrefundable") {
						return { color: "#919090" };
					}
				},
			},
			{
				headerName: "Bank ID",
				field: "counter_account_bank_id",
				sortable: true,
				resizable: true,
				flex: 1,
				cellStyle: function (params: any) {
					if (params.data.transaction_status === "Nonrefundable") {
						return { color: "#919090" };
					}
				},
			},
			{
				headerName: "Account Number",
				field: "counter_account_number",
				sortable: true,
				resizable: true,
				flex: 1,
				cellStyle: function (params: any) {
					if (params.data.transaction_status === "Nonrefundable") {
						return { color: "#919090" };
					}
				},
			},
			{
				headerName: "Account Name",
				field: "counter_account_name",
				sortable: true,
				resizable: true,
				flex: 1.8,
				filter: true,
				cellStyle: function (params: any) {
					if (params.data.transaction_status === "Nonrefundable") {
						return { color: "#919090" };
					}
				},
			},
			{
				headerName: "Amount",
				field: "amount",
				sortable: true,
				resizable: true,
				flex: 0.8,
				cellStyle: function (params: any) {
					if (params.data.transaction_status === "Nonrefundable") {
						return { color: "#919090" };
					}
				},
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
			{
				headerName: "Remaining Amount",
				field: "amount_remaining",
				sortable: true,
				resizable: true,
				flex: 1.2,
				filter: true,
				cellStyle: function (params: any) {
					if (params.data.amount_remaining === "0") {
						return { color: "green" };
					}
					if (params.data.transaction_status === "Nonrefundable") {
						return { color: "#919090" };
					}
					return { color: "red" };
				},
			},
		]);
	};
	const handleClickRefund = () => {
		setIsOpen(true);
	};
	useEffect(() => {
		const fetchData = async () => {
			if (eventId) {
				try {
					const response = await fetchJSON(
						`${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/refund/refunding/${eventId}`,
					);
					if (response.status == "refunding") {
						if (isShowInvalidTrans) {
							setSpinnerAll(true);
							setIsDisable(true);
						}
					} else {
						setSpinnerAll(false);
						if (isShowInvalidTrans) {
							setIsDisable(false);
						}
					}
				} catch (error) {
					console.error("Failed to fetch data: ", error);
				}
			}
		};
		fetchData();
		if (isShowInvalidTrans) {
			const intervalId = setInterval(fetchData, 1000); // Fetch data every 5 seconds
			return () => clearInterval(intervalId);
		}
	}, [eventId, setSpinnerAll, isShowInvalidTrans]);

	return (
		<>
			<SettingSection>
				<SettingSection.Header>Your events</SettingSection.Header>
				<div className="flex items-center justify-start space-x-10">
					<EventComboboxWrapper />
					{pathname === "/admin/transactions" ? (
						<>
							<button
								className="bg-blue-400 py-2 px-4 rounded-md font-bold text-white hover:bg-blue-500 disabled:bg-slate-200"
								onClick={handleClick}
								disabled={!eventId}
							>
								Refund Transaction
							</button>
							<button
								className="bg-red-400 py-2 px-4 rounded-md font-bold text-white hover:bg-red-500 disabled:bg-slate-200"
								onClick={handleClickRefund}
								disabled={isDisable}
							>
								{spinnerAll ? (
									<div className="px-7">
										<Spinner width={5} height={5} />
									</div>
								) : (
									<p>Refund All</p>
								)}
							</button>
							<DialogRefundAll isOpen={isOpen} setIsOpen={setIsOpen}></DialogRefundAll>
						</>
					) : null}
				</div>
			</SettingSection>
		</>
	);
};
