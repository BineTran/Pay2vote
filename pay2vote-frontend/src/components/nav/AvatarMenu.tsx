"use client";
import React, { FC, memo, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { TabContents } from "../admin/tabs/TabContents";
import { useTab } from "@/hooks/useTab";
import { handleLogout } from "@/utils/authUtils";
import { useCookie } from "@/hooks/useCookie";
import LoginButton from "../auth/LoginButton";
import { useEffect } from "react";
import { AvatarMenuSkeleton } from "./AvatarMenuSkeleton";
import { usePathname, useRouter } from "next/navigation";

interface AvatarMenuProps {
	menuButton: React.ReactNode | null;
}

const CustomMenuItems = () => {
	const { setSelectedTab } = useTab();
	const router = useRouter();
	const pathname = usePathname();

	const handleTabClicked = async (index: number) => {
		if (TabContents[index].name === "Logout") {
			await handleLogout();
			if (pathname === "/") {
				router.refresh();
			}
		}
		setSelectedTab(index);
		console.log(`Selected tab set to ${index}`);
	};

	return TabContents.map((tab, index) => (
		<Menu.Item key={index}>
			{/* Active here mean that user hover on it */}
			{({ active }) => (
				<Link
					href={tab.href}
					className={`${active ? "bg-favoriteBlue text-white" : "text-gray-900"}
            group flex w-full rounded-md p-2 text-sm transform-colors duration-200`}
					onClick={() => handleTabClicked(index)}
				>
					<div className="flex gap-1 items-center">
						{tab.icon}
						{tab.name}
					</div>
				</Link>
			)}
		</Menu.Item>
	));
};

export const AvatarMenu: FC<AvatarMenuProps> = memo(function AvatarMenu({ menuButton }) {
	const [isMounted, setIsMounted] = useState(false);
	const user = useCookie("user");
	useEffect(() => {
		setIsMounted(true);
	}, []);
	return (
		<>
			{isMounted ? (
				user ? (
					<Menu as="div" className={"relative flex text-left  w-full h-full z-50"}>
						{/* Open mean click on it  */}
						{({ open }) => (
							<div>
								{/* Menu button in navigation bar  */}
								<Menu.Button as={"div"} className={"flex justify-center items-center w-full h-full"}>
									{menuButton}
								</Menu.Button>
								<Transition
									enter="transition ease-out duration-100"
									enterFrom="transform opacity-0 scale-95"
									enterTo="transform opacity-100 scale-100"
									leave="transition ease-in duration-75"
									leaveFrom="transform opacity-100 scale-100"
									leaveTo="transform opacity-0 scale-95"
								>
									{open && (
										<Menu.Items
											className="absolute right-0 origin-top-right mt-2
									divide-y divide-gray-100 bg-white rounded-md shadow-lg
									ring-1 ring-black ring-opacity-5 
									focus:outline-none"
										>
											<div className="p-2">
												<CustomMenuItems />
											</div>
										</Menu.Items>
									)}
								</Transition>
							</div>
						)}
					</Menu>
				) : (
					<LoginButton />
				)
			) : (
				<AvatarMenuSkeleton />
			)}
		</>
	);
});
