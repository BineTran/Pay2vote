import { UserForm } from "@/components/auth/LoginForm";

export const loginRequest = async (url: string, data: UserForm) => {
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error.message || "Internal server error");
	}

	const responseData = await response.json();
	return responseData;
};
