import { typeDataTeam } from "@/components/utils/ChartSupport";
import { fetchJSON } from "@/utils/requestJSON";

export async function generateStaticParams({ params: { eventId } }: any): Promise<any[]> {
	// console.log("Event ID in generating static params", eventId);

	const allTeam: typeDataTeam[] = (await fetchJSON(
		`${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/team/eventId/${eventId}`,
	)) as typeDataTeam[];

	return allTeam.map((team) => {
		// console.log("EventID, TeamId in calculating dynamic route:", team.event_id.toString(), team.id.toString());

		return {
			eventId: team.event_id.toString(),
			teamId: team.id.toString(),
		};
	});
}

export default function Layout({ children }: { children: any }) {
	return <>{children}</>;
}
