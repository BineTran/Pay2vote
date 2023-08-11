"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import { useLayoutEffect } from "react";

/**
 * Hook to retrieve the value of a cookie and keep it updated.
 *
 * Dependencies: "react", "js-cookie"
 *
 * Usage:
 *   const cookieValue = useCookie(cookieName);
 *
 * @param cookieName - The name of the cookie to retrieve.
 * @returns The value of the cookie.
 */
export const useCookie = (cookieName: string) => {
	const [cookie, setCookie] = useState<string | undefined>(undefined);

	useLayoutEffect(() => {
		const value = Cookies.get(cookieName);
		setCookie(value);
	}, [cookieName]);

	return cookie;
};
