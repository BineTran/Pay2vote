import React, { Suspense, memo } from "react";
import Logo from "./Logo";
import SearchNav from "./SearchNav";
import NavLink from "./NavLink";
import { AvatarMenu } from "@/components/nav/AvatarMenu";
import { AvatarMenuButton } from "@/components/nav/AvatarMenuButton";
import { AvatarMenuSkeleton } from "./AvatarMenuSkeleton";
import { SearchNavSkeleton } from "./EventCombobox";
import { NavbarSkeleton } from "./NavbarSkeleton";

const NavbarContainer = memo(async function NavbarContainer() {
	return (
		<nav className=" bg-white border-b border-gray-500/50 dark:bg-gray-900 shadow-md ">
			<div className="max-w-screen-xl flex flex-wrap min-h-[7vh] items-center justify-between mx-auto p-2 ">
				{/** Logo and name of site */}
				<Logo />

				{/* Navigate link */}
				<NavLink />

				{/** For the love of god i don't know*/}
				<Suspense fallback={<SearchNavSkeleton />}>
					<SearchNav />
				</Suspense>

				<div className="flex md:order-3 w-72 ">
					{/* <LogoutButton /> */}
					<Suspense fallback={<AvatarMenuSkeleton />}>
						<AvatarMenu menuButton={<AvatarMenuButton />} />
					</Suspense>
				</div>
			</div>
		</nav>
	);
});

export default function Navbar() {
	return (
		<>
			<Suspense fallback={<NavbarSkeleton />}>
				<NavbarContainer />
			</Suspense>
		</>
	);
}
