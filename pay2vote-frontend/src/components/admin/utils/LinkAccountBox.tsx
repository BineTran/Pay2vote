"use client";

import React, { useEffect, useState } from "react";
import { openWindow } from "@/utils/window";
import { fetchJSON, postJSON } from "@/utils/requestJSON";
import useAccessToken from "@/hooks/useAccessToken";
import { useMessageListener } from "@/hooks/useMessageListener";
import Spinner from "@/components/ui/Spinner";
import { config } from "@/utils/config";
import BankLinkedConfirm from "@/components/admin/utils/BankLinkedConfirm";
import { toast } from "react-toastify";
import useAccessTokenRefund from "@/hooks/useAccessTokenRefund";
import { NormalButton } from "@/components/ui/NormalButton";

const BANKHUB_URL_API = config.apiRoute.BANKHUB_URL_API;
const BANKHUB_ACCESS_TOKEN_API = config.apiRoute.BANKHUB_ACCESS_TOKEN_API;

const ACCESS_TOKEN = "accessToken";
const ACCESS_TOKEN_REFUND = "accessTokenRefund";

export type FIAccountType = "normal" | "refund";

type LinkAccountBoxProps = {
	accountType: FIAccountType;
	title: string;
	isActive: boolean;
	onLink: React.Dispatch<React.SetStateAction<FIAccountType | null>>;
};

export default function LinkAccountBox({ accountType, title, isActive, onLink }: LinkAccountBoxProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [hasMounted, setHasMounted] = useState<boolean>(false);

	const accessToken = useAccessToken() as string;
	const accessTokenRefund = useAccessTokenRefund() as string;

	const isNormalAccount = accountType === "normal";

	useEffect(() => {
		setHasMounted(true);
	}, []);

	useMessageListener(async (publicToken: string) => {
		if (!isActive) {
			// This Link is not active, ignored
			return;
		}
		try {
			console.log(isActive, accountType, isNormalAccount);

			// Fetch access token from bankhub
			const { response } = await postJSON(BANKHUB_ACCESS_TOKEN_API, { publicToken, accountType });
			console.log("Received access token");
			// Save access token in local storage
			localStorage.setItem(isNormalAccount ? ACCESS_TOKEN : ACCESS_TOKEN_REFUND, response.accessToken);
			console.log("Access token saved...");
			window.location.reload();
		} catch (error: any) {
			console.error(`Failed to fetch access token: ${error.message}`);
		}
	});

	const handleLinkBankAccountButtonClick = async () => {
		setIsLoading(true);
		try {
			console.log(accountType);

			onLink(accountType); // Indicate that this LinkAccountBox is now active
			const { bankHubUrl } = await fetchJSON(BANKHUB_URL_API);
			if (bankHubUrl) {
				openWindow(bankHubUrl);
			}
		} catch (error: any) {
			setError(`Failed to fetch data: ${error.message}`);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<div className="text-center">
				<Spinner />
			</div>
		);
	}

	if (error) {
		toast.error(error);
	}

	return (
		<div className="flex flex-row items-center gap-x-3">
			<NormalButton onClick={handleLinkBankAccountButtonClick}>{title}</NormalButton>

			<div className="">
				{hasMounted ? (
					<BankLinkedConfirm accessToken={isNormalAccount ? accessToken : accessTokenRefund} />
				) : (
					<Spinner />
				)}
			</div>
		</div>
	);
}
