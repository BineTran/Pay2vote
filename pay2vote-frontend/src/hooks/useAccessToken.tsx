/**
 * This custom hook retrieves the access token stored in the local storage.
 *
 * @returns {string | null} - The access token, or null if the access token doesn't exist or if the environment is server-side.
 */
const useAccessToken = (): string | null => {
	if (typeof window !== "undefined") {
		return localStorage.getItem("accessToken");
	}
	return null;
};

export default useAccessToken;
