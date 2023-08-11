import DetailContent from "@/components/detail/DetailContent";
import Navbar from "@/components/nav/Navbar";

type Params = {
	params: {
		eventId: string;
		teamId: string;
	};
};

export default function TeamDetailPage({ params }: Params) {
	const eventId = parseInt(params.eventId, 10);
	const teamId = parseInt(params.teamId, 10);
	return (
		<>
			<div className="flex flex-col items-center min-h-screen w-screen ">
				{/* Navigation bar in h-screen */}
				<div className="w-full order-1 z-50">
					<Navbar />
				</div>
				{/* ---- */}
				<DetailContent eventId={eventId} teamId={teamId} />
			</div>
		</>
	);
}
