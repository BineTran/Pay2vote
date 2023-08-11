import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

export default function LoginButton() {
	const router = useRouter();
	const handleLoginClick = () => {
		router.push("/login");
	};
	return (
		<div
			className="flex justify-center items-center bg-white border-1 border-gray-500/50 rounded-lg shadow-sm hover:shadow-lg
                        hover:border-white 
                        transition:colors duration-200"
		>
			<Link href="/login">
				<button
					className="px-4 py-2 text-black font-semibold text-md  hover:from-purple-500 hover:to-pink-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r transition:colors duration-200"
					onClick={handleLoginClick}
				>
					Login
				</button>
			</Link>
		</div>
	);
}
