import React from "react";

type NormalButtonProps = {
	onClick?: () => void;
	children?: React.ReactNode;
	customGradientFromTo?: string;
	disable?: boolean;
};

export const NormalButton = ({ onClick, children, customGradientFromTo, disable = false }: NormalButtonProps) => {
	const customGradient = customGradientFromTo?.split(" ");
	const color = customGradientFromTo ? customGradientFromTo : "from-purple-500 to-pink-500";

	const hoverStyle = customGradient
		? `group-hover:${customGradient[0]} group-hover:${customGradient[1]} `
		: "group-hover:from-purple-500 group-hover:to-pink-500 ";

	const shadowStyle = customGradient
		? `shadow-${customGradient[1].split("-")[1]}-${customGradient[1].split("-")[2]}/50`
		: "shadow-pink-500/50";

	return (
		<button
			className={`relative inline-flex items-center justify-center p-0.5 overflow-hidden 
			text-md font-semibold text-gray-900 rounded-lg 
			group enabled:bg-gradient-to-br ${color} ${hoverStyle}
			hover:text-white focus:none focus:outline-none focus:ring-purple-200 shadow-md ${shadowStyle}
			disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none disabled:pointer-events-none`}
			onClick={onClick}
			disabled={disable}
		>
			<span
				className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md hover:bg-opacity-0 
			disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none disabled:pointer-events-none"
			>
				{children}
			</span>
		</button>
	);
};
