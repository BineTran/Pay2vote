/**
 * Simple hook to delay time
 * @param time Delay time
 */
const useDelay = async (time: number) => {
	await new Promise((resolve) => setTimeout(resolve, time));
};

export default useDelay;
