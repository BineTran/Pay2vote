import useSWR from "swr";

type SWRReturnType<T> = {
	data: T | undefined;
	isLoading: boolean;
	isError: any;
};

/**
 * A simple fetcher for custom SWR which is not using simple wrapper
 * @param url Fetch URL
 * @returns Promise<any>
 */
export const fetcher = async (url: string) => {
	const res = await fetch(url, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});
	// await new Promise((resolve) => setTimeout(resolve, 5000));
	if (!res.ok) {
		const errorData = await res.json();
		throw new Error(errorData.error.message || "An error occur while fetching data");
	}

	return res.json();
};

/**
 * A simple SWR wrapper
 * @param url Fetch URL
 * @returns {SWRReturnType} An object containing data, isLoading and isError
 */
export default function useFetchSWR(url: string, optionalKey?: any): SWRReturnType<any> {
	const key = optionalKey ? [url, optionalKey] : url;
	const { data, error, isLoading } = useSWR(key, fetcher);
	return {
		data: data,
		isLoading,
		isError: error,
	};
}
