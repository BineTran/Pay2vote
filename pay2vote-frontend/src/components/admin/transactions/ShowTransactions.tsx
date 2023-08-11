import React, { useEffect, useRef, useState } from "react";
import { useEventContext } from "@/hooks/useEventContext";
import { SettingSection } from "../utils/SettingSection";
import { TableTrans } from "./TableTrans";

export const ShowTable = () => {
	const { eventId, isShowInvalidTrans } = useEventContext();
	const tableRef = useRef<HTMLDivElement>(null);
	const [isTableLoading, setIsTableLoading] = useState(true);

	useEffect(() => {
		if (eventId !== null && tableRef.current) {
			// scroll to the table component
			setTimeout(() => {
				tableRef.current!.scrollIntoView({ behavior: "smooth" });
			}, 200);
		}
	}, [eventId, isTableLoading]);
	return (
		<>
			<SettingSection>
				<SettingSection.Header>Transactions</SettingSection.Header>
				<div className=" w-full items-center justify-start" ref={tableRef}>
					{/* List teams of event chosen  */}
					{!isShowInvalidTrans ? (
						eventId ? (
							<TableTrans setIsTableLoading={setIsTableLoading} />
						) : (
							<p className="text-gray-500">
								You have not selected an event or you have not organized any event
							</p>
						)
					) : (
						<TableTrans setIsTableLoading={setIsTableLoading} />
					)}
				</div>
			</SettingSection>
		</>
	);
};
