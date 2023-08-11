"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

type NavItemProps = {
	href: string;
	title: string;
};

export const NavItem = memo(function NavItem({ href, title }: NavItemProps) {
	const isActive = usePathname() === href;
	return (
		<li>
			<Link
				href={href}
				className={`block py-2 pl-3 pr-4 rounded md:p-0 ${
					isActive
						? "bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text"
						: "text-gray-900 hover:from-purple-500 hover:to-pink-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r"
				}`}
			>
				{title}
			</Link>
		</li>
	);
});
