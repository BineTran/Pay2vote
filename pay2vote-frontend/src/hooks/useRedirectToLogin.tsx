"use client";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * Hook to redirect the user to the login page if the user cookie is not present.
 *
 * Dependencies: "js-cookie", "next/navigation", "react"
 *
 * Usage:
 *   useRedirectToLogin();
 */
export const useRedirectToLogin = () => {
	useLayoutEffect(() => {
		// Get user cookie
		const userCookie = Cookies.get("user");
		// Check if cookie exist
		if (!userCookie) {
			redirect("/login");
		}
	});
};
