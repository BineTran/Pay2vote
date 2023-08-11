"use client";
import { ContentPanel } from "./contents/ContentPanel";
import { SideTabPanel } from "./tabs/SideTabPanel";
import { TabItemList } from "./tabs/TabItemList";
import { PropsWithChildren, memo } from "react";
import { useRedirectToLogin } from "@/hooks/useRedirectToLogin";

export const AdminContent = memo(function AdminContent({ children }: PropsWithChildren) {
	useRedirectToLogin();
	return (
		<>
			<SideTabPanel>
				<TabItemList />
			</SideTabPanel>

			<ContentPanel>{children}</ContentPanel>
		</>
	);
});
