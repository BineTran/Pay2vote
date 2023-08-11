import { TabContext } from "@/context/TabContext";
import { useContext } from "react";
export const useTab = () => {
	const context = useContext(TabContext);

	if (!context) {
		throw new Error("useTab must be used within a TabProvider");
	}

	return context;
};
