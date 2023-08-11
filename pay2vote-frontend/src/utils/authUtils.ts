"use client";
import Cookies from "js-cookie";
import { config } from "@/utils/config";

export const handleLogout = async () => {
	try {
		const response = await fetch(config.apiRoute.LOGOUT_API, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Logout failed");
		}

		// Delete cookie
		Cookies.remove("user");
		Cookies.remove("username");
	} catch (error) {
		console.error("Logout error", error);
	}
};
