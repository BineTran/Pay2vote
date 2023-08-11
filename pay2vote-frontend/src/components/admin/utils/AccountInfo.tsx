"use client";
import React, { memo, useEffect, useState } from "react";
import { AccountProperty } from "./AccountInfoBox";
import { UserInfo } from "./AccountInfoBox";
import { postJSON } from "@/utils/requestJSON";
import useAccessToken from "@/hooks/useAccessToken";
import Spinner from "@/components/ui/Spinner";
import { config } from "@/utils/config";
import { FIAccountType } from "./LinkAccountBox";
import useAccessTokenRefund from "@/hooks/useAccessTokenRefund";

type AccountInfoProps = {
	accountType: FIAccountType;
};

export const AccountInfo = memo(function AccountInfo({ accountType }: AccountInfoProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [userInfo, setUserInfo] = useState<UserInfo>({
		username: null,
		name: null,
		account_number: null,
		account_name: null,
	});
	const isNormalAccount = accountType === "normal";
	const normalAccessToken = useAccessToken();
	const refundAccessToken = useAccessTokenRefund();
	const accessToken = isNormalAccount ? normalAccessToken : refundAccessToken;

	const USER_INFO_API = isNormalAccount ? config.apiRoute.USER_INFO_API : config.apiRoute.USER_REFUND_INFO_API;

	const fetchUserInfo = async (accessToken: string) => {
		setIsLoading(true);
		try {
			const response = (await postJSON(`${USER_INFO_API}`, { accessToken })) as UserInfo;
			setUserInfo(response);
			// console.log("Response in admin:", response);
		} catch (error: any) {
			console.error("Failed to fetch user data:", error);
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		if (accessToken) {
			fetchUserInfo(accessToken);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accessToken]);

	// Mapping for clearer property name
	const propertyNameMappingENG: { [key: string]: string } = {
		username: "Username",
		name: "Bank Name",
		account_number: "Account Number",
		account_name: "Account Name",
	};

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (isLoading) {
		return <p>Loading...</p>;
	}

	return (
		<>
			{Object.entries(userInfo).map(([key, value]) => (
				<AccountProperty key={`${key}`}>
					<div className="flex flex-row gap-4">
						{propertyNameMappingENG[key] || key}:{" "}
						{(value as string | number) ? (
							value
						) : (
							<div className="w-4 h-4">
								<Spinner width={4} height={4} />
							</div>
						)}
					</div>
				</AccountProperty>
			))}
		</>
	);
});
