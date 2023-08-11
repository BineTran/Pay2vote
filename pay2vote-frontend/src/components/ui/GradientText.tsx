import React from "react";
import "../../app/globals.css";
import "./GradientText.css";

type GradientTexProps = {
	textStyle?: string;
	position?: string;
	children: React.ReactNode;
	onlyHover?: boolean;
	className?: string;
};

export const GradientText = ({ textStyle, position, children, onlyHover = false, className }: GradientTexProps) => {
	const baseColorClasses = "bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent";
	const hoverColorClasses = baseColorClasses
		.split(" ")
		.map((property) => `hover:${property}`)
		.join(" "); // Added this line to join the classes into a single string

	const colorClasses = onlyHover ? `text-black ${hoverColorClasses}` : `${baseColorClasses}`;
	const textClasses = textStyle ? textStyle : "text-5xl font-semibold";
	const positionClasses = position;

	return (
		<div className={`flex flex-wrap ${colorClasses} ${textClasses} ${positionClasses} ${className}`}>
			{children}
		</div>
	);
};
