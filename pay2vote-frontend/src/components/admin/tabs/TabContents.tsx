import { ReactElement } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineHistory } from "react-icons/ai";
import { AiOutlineCalendar } from "react-icons/ai";
import { AiOutlineTeam } from "react-icons/ai";
// import { AiOutlineSetting } from "react-icons/ai";
import { AiOutlineLogout } from "react-icons/ai";

export type Tab = {
	name: string;
	icon: ReactElement;
	href: string;
};

export const TabContents: Tab[] = [
	{
		name: "Profile",
		icon: <AiOutlineUser />,
		href: "/admin",
	},
	{
		name: "Transactions",
		icon: <AiOutlineHistory />,
		href: "/admin/transactions",
	},
	{
		name: "Events",
		icon: <AiOutlineCalendar />,
		href: "/admin/events",
	},
	{
		name: "Teams",
		icon: <AiOutlineTeam />,
		href: "/admin/teams",
	},
	// {
	// 	name: "Setting",
	// 	icon: <AiOutlineSetting />,
	// 	href: "/admin/setting",
	// },
	{
		name: "Logout",
		icon: <AiOutlineLogout />,
		href: "/",
	},
];
