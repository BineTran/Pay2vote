import React from "react";
import Image from "next/image";

export default function Logo() {
	return (
		<a href="/" className="flex flex-wrap items-center">
			<Image src="/images/V_logo.png" className="mr-2 w-10" alt="Pay 2 Vote Logo" width={60} height={60} />
			<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">PAY2VOTE</span>
		</a>
	);
}
