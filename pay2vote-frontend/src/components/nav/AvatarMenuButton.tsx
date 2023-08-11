"use client";
import React, { memo } from "react";
import { AiOutlineDown } from "react-icons/ai";
import { motion } from "framer-motion";
import { useCookie } from "@/hooks/useCookie";
import { AvatarHolder } from "./AvatarHolder";

const NameHolder = memo(function NameHolder() {
	const username = useCookie("username");
	return <>{username}</>;
});

interface AvatarMenuButton {
	avatar: React.ReactNode;
}

export const AvatarMenuButton = memo(function AvatarMenuButton() {
	return (
		<div
			className={`inline-flex w-full h-full justify-center items-center
                overflow-hidden group`}
		>
			<div
				className="inline-flex w-full h-full  justify-center items-center gap-2
                 cursor-default hover:text-purple-500 group-hover:text-pink-500
                transition-colors duration-200
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
			>
				<motion.div
					initial={{ x: "80%" }}
					animate={{ x: "0%" }}
					transition={{ type: "spring", bounce: 0.1, duration: 1 }}
					className="inline-flex w-full h-full  justify-center items-center gap-2"
				>
					{/* Separate avatar to keep it clean */}
					<AvatarHolder imageUrl={"/images/confused_husky.jpg"} altText={"husky"} className={""} />
					{/* This is the text  */}
					<div className="inline-flex gap-1 text-md font-semibold">
						<p className="">{"Welcome back, "}</p>
						<NameHolder />
					</div>
					<AiOutlineDown />
				</motion.div>
			</div>
		</div>
	);
});
