export async function fetchJSON(url: string): Promise<any> {
	const response = await fetch(url, {
		credentials: "include",
	});

	if (!response.ok) {
		const errorData = await response.json();
		console.log("error", errorData.error);

		throw new Error(errorData.error.message || "Internal server error");
	}

	const data: any = await response.json();
	return data;
}

export async function postJSON(url: string, data: any): Promise<any> {
	const response = await fetch(url, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error.message || "Internal server error");
	}

	const responseData: any = await response.json();
	return responseData;
}
