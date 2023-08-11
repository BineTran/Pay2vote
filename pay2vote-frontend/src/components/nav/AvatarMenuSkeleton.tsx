import React from "react";
import { Skeleton } from "../ui/Skeleton";

export const AvatarMenuSkeleton = () => {
	return (
		<div className="flex flex-row gap-2 items-center">
			<Skeleton count={1} width="w-12" height="h-12" variant="image" />
			<Skeleton count={1} width="w-60" height="h-6" />
		</div>
	);
};
