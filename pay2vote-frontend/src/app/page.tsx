import React from "react";
import Navbar from "@/components/nav/Navbar";
import Popup from "@/components/utils/Popup";
import Background from "@/components/ui/Background";
import { HomepageContainer } from "@/components/home/HomepageContainer";

export default function Home() {
	return (
		<main className="">
			<Popup />
			<Navbar />
			<HomepageContainer />
			<Background />
		</main>
	);
}
