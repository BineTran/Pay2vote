"use client";
import React from "react";
import useDataSWR from "@/hooks/useDataSWR";
import { toast } from "react-toastify";
import { Skeleton } from "../ui/Skeleton";
import { GradientText } from "../ui/GradientText";

export const NameEvent = ({ eventID }: { eventID: number }) => {
	const { data, isLoading, isError } = useDataSWR(
		`${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/event/id/${eventID}`,
	);
	if (isError) {
		toast.error(`${isError}`);
	}
	return isLoading ? (
		<Skeleton count={1} height="h-12" width="w-96" />
	) : (
		<div>
			<GradientText className="">ALL TEAMS IN {data.name.toUpperCase()}</GradientText>
		</div>
	);
};
