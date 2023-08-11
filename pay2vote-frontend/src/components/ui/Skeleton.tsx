import React, { memo } from "react";
import "./Skeleton.css";

type SkeletonProps = {
	variant?: "text" | "card" | "image";
	count?: number;
	width?: string;
	height?: string;
};

export const Skeleton = memo(function Skeleton({
	variant = "text",
	count = 1,
	width = "w-full",
	height = "h-6",
}: SkeletonProps) {
	const baseClasses = `relative  overflow-hidden bg-gray-300 skeleton-shimmer ${variant} ${width} ${height}`;

	const variantClasses = {
		text: "rounded-md",
		card: "rounded-lg",
		image: "rounded-full",
	};

	const skeletonClasses = `${baseClasses} ${variantClasses[variant]}`;

	return (
		<>
			{Array.from({ length: count }).map((_, index) => (
				<div key={`skeleton-${variant}-${index}`} className={skeletonClasses}></div>
			))}
		</>
	);
});
