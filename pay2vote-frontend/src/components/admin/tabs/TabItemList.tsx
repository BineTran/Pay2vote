"use client";
import React, { memo } from "react";
import { TabItem } from "./TabItem";
import { Tab, TabContents } from "./TabContents";
import { usePathname, useRouter } from "next/navigation";
import { useTab } from "@/hooks/useTab";
import { handleLogout } from "@/utils/authUtils";

export const TabItemList = memo(function TabItemList() {
	const pathname = usePathname();
	const router = useRouter();
	const { selectedTab, setSelectedTab } = useTab();

	const isActiveTab = (tabHref: string, tabIndex: number) => {
		return pathname === tabHref && selectedTab === tabIndex;
	};

	const navigateToTab = async (tab: Tab, index: number) => {
		if (tab.name === "Logout") {
			await handleLogout();
			if (pathname === "/") {
				router.refresh();
			} else {
				router.push("/");
			}
			return;
		}

		setSelectedTab(index);
		router.push(tab.href);
	};

	return (
		<>
			{TabContents.map((tab, index) => (
				<TabItem
					key={tab.name}
					name={tab.name}
					icon={tab.icon}
					active={isActiveTab(tab.href, index)}
					onClick={() => navigateToTab(tab, index)}
				/>
			))}
		</>
	);
});
