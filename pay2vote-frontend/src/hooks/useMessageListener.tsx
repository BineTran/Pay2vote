import { useEffect } from "react";

type Callback = (publicToken: string) => void;

/**
 * This custom hook abstracts a message event listener which is set up to listen for a public token being sent from a popup of the main page.
 *
 * @param {Callback} callback - The callback function to be executed when a public token is received from the popup.
 *
 * The listener is attached when the component mounts and automatically removed when the component unmounts.
 */
export const useMessageListener = (callback: Callback) => {
	useEffect(() => {
		// Listen for message from the popup
		const receiveMessage = async (event: MessageEvent) => {
			if (event.data && event.data.publicToken) {
				callback(event.data.publicToken);
			}
		};
		window.addEventListener("message", receiveMessage);

		// Clean up the event listener when the component unmount
		return () => {
			window.removeEventListener("message", receiveMessage);
		};
	}, [callback]);
};
