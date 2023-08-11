"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { WhiteScreen } from "../ui/WhiteScreen";
import { config } from "@/utils/config";

export default function Popup() {
	const searchParams = useSearchParams();
	const publicToken = searchParams.get("publicToken");
	useEffect(() => {
		if (typeof window !== "undefined") {
			// Client-side-only code
			// useSendPublicToken();
			if (publicToken) {
				// Send public token to parent window
				window.opener.postMessage(
					{
						publicToken: publicToken,
					},
					`${config.clientDomain}/admin`,
				);
				// Immediately close popup
				window.close();
			}
		}
	});
	// Not render page if page have public token
	if (publicToken) {
		return <WhiteScreen />;
	}
	return <></>;
}
