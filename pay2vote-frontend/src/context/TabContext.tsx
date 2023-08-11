"use client";
import { Dispatch, SetStateAction, createContext, useState } from "react";
import { TabContents } from "../components/admin/tabs/TabContents";
import { usePathname } from "next/navigation";

interface ContextInit {
	selectedTab: number;
	setSelectedTab: Dispatch<SetStateAction<number>>;
}

const initialContext: ContextInit = {
	selectedTab: 0,
	setSelectedTab: () => {}, // Provide a noop function as initial setter
};

export const TabContext = createContext<ContextInit>(initialContext);

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	const initIndex = TabContents.findIndex((tab) => tab.href === pathname);

	// If pathname is not found in TabContents, default to the first tab
	const initialSelectedTab = initIndex !== -1 ? initIndex : 0;

	const [selectedTab, setSelectedTab] = useState<number>(initialSelectedTab);
	const value = { selectedTab, setSelectedTab };

	return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};
