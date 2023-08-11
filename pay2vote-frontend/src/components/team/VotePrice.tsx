"use client";
import useFetchSWR from "@/hooks/useDataSWR";
import React from "react";
import { config } from "@/utils/config";
import { Skeleton } from "../ui/Skeleton";
import { toast } from "react-toastify";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const VotePrice = ({ eventID }: { eventID: number }) => {
	const { data, isLoading, isError } = useFetchSWR(`${config.serverDomain}/api/v1/price/eventID/4`);
	if (isError) {
		toast.error(`${isError}`);
	}
	return isLoading ? (
		<Skeleton />
	) : data.length === 0 ? null : (
		<div className="">
			<table className=" w-full text-sm text-center text-gray-500 dark:text-gray-400">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" className="px-6 py-3">
							Price
						</th>
						<th scope="col" className="px-6 py-3">
							Point
						</th>
					</tr>
				</thead>
				<tbody>
					{data.map((item: any, index: any) => (
						<tr className="border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
							<th
								scope="row"
								className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
							>
								{item.price}
							</th>
							<td className="px-6 py-4">{item.point}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
