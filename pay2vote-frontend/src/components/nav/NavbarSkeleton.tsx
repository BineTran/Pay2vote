import React, { memo } from "react";
import Logo from "./Logo";
import NavLink from "./NavLink";
import { AvatarMenuSkeleton } from "./AvatarMenuSkeleton";
import { SearchNavSkeleton } from "./EventCombobox";

export const NavbarSkeleton = memo(function NavbarSkeleton() {
	return (
		<nav className=" bg-white border-b border-gray-500/50 dark:bg-gray-900 shadow-md min-h-[7vh]">
			<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
				{/** Logo and name of site */}
				<Logo />
				{/* Navigate link */}
				<NavLink />
				{/** For the love of god i don't know*/}
				<SearchNavSkeleton />

				<div className="flex md:order-3 w-72 ">
					{/* <LogoutButton /> */}
					<AvatarMenuSkeleton />
				</div>
			</div>
		</nav>
	);
});
