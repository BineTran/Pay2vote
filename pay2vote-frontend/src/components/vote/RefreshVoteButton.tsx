"use client";
import React, { useState } from "react";
import { NormalButton } from "../ui/NormalButton";
import { postJSON } from "@/utils/requestJSON";
import { config } from "@/utils/config";
import { toast } from "react-toastify";
import Spinner from "../ui/Spinner";

type RefreshVoteButtonProps = {
	eventId: number;
};

export const RefreshVoteButton = ({ eventId }: RefreshVoteButtonProps) => {
	const [loading, setLoading] = useState(false);
	const [disabled, setDisabled] = useState(false);

	const handleRefreshClick = async () => {
		setLoading(true);
		setDisabled(true);
		try {
			await postJSON(config.apiRoute.REFRESH_AN_EVENT, { eventId });
		} catch (error: any) {
			console.log("An error occur in refresh vote:", error);
			toast.error("An error occur in refresh vote");
		} finally {
			setTimeout(() => {
				setDisabled(false);
			}, 15000);
		}
		setLoading(false);
	};

	return (
		<NormalButton onClick={handleRefreshClick} disable={disabled}>
			<div className="flex w-full h-full justify-center items-center ">
				<div className="w-28">{loading ? <Spinner width={5} height={5} color="pink" /> : "Refresh votes"}</div>
			</div>
		</NormalButton>
	);
};
