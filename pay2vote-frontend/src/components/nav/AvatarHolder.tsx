import { memo } from "react";
import Image from "next/image";
import Avatar from "react-nice-avatar";
import { genConfig } from "react-nice-avatar";

export interface AvatarProps {
	imageUrl: string;
	altText: string;
	className: string;
	showPlaceholder?: boolean;
	teamName?: string;
}

export const AvatarHolder = memo(function AvatarHolder({
	imageUrl,
	altText,
	className,
	showPlaceholder = false,
	teamName,
}: AvatarProps) {
	return (
		<div
			className={`relative w-12 h-12 aspect-square rounded-full overflow-hidden border border-favoriteGray/50 ${className}`}
		>
			{showPlaceholder ? (
				<Avatar className="w-full h-full" {...genConfig(teamName)} />
			) : (
				<Image src={imageUrl} fill={true} alt={altText} sizes="(max-sizes: 1024px) 15vh" />
			)}
		</div>
	);
});
