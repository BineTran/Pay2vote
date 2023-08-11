import React from "react";

export const SideTabPanel = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			className="flex flex-col flex-start w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 h-full p-2
         overflow-y-auto  bg-white rounded-bl-md shadow-xl 
        border border-gray-500/50
        "
		>
			{children}
		</div>
	);
};
