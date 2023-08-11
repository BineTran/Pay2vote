import React from "react";
import { LoginForm } from "./LoginForm";
import { config } from "@/utils/config";

export default function AuthBox() {
	return (
		<div className="flex flex-wrap h-[80vh] justify-center items-center">
			<div className="flex flex-wrap items-center justify-center border-2 border-green-50/50 bg-white rounded-lg shadow-lg ">
				<LoginForm title="Login" url={config.apiRoute.LOGIN_API} />
			</div>
		</div>
	);
}
