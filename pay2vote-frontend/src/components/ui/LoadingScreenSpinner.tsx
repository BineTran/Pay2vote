import React from "react";
import Spinner from "./Spinner";

export default function LoadingScreenSpinner() {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-cyan-500/10  to-violet-300/10">
			<div className="flex flex-row gap-4 bg-white w-64 p-4 rounded shadow-xl justify-center items-center">
				<h2 className="text-xl font-bold text-center">Loading...</h2>
				<Spinner />
			</div>
		</div>
	);
}
