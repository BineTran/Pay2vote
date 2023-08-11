import { useLayoutEffect } from "react";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export const useRedirectToHome = () => {
	useLayoutEffect(() => {
		// Get user cookie
		const userCookie = Cookies.get("user");
		// Check if cookie exist
		if (userCookie) {
			redirect("/");
		}
	});
};
