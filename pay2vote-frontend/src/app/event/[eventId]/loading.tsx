import { NavbarSkeleton } from "@/components/nav/NavbarSkeleton";
import { ListTeamsSkeleton } from "@/components/team/ListTeamsSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
	return (
		<>
			<NavbarSkeleton />
			<div className="relative min-h-[80vh]">
				<div className="flex items-center m-5 flex-col">
					<Skeleton count={1} height="h-12" width="w-24" />
				</div>
				<div className="grid grid-cols-5 gap-6 w-full p-4">
					<ListTeamsSkeleton />
				</div>
				<div className="flex items-center m-5 flex-col">
					<Skeleton count={1} width="w-24" height="h-12" variant="card" />
				</div>
			</div>
		</>
	);
}
