import React from "react";
import AuthBox from "@/components/auth/AuthBox";
import Navbar from "@/components/nav/Navbar";

export default function LoginPage() {
	return (
		<div className="h-screen">
			<Navbar />
			<AuthBox />
		</div>
	);
}
