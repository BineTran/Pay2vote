import { fetchJSON } from "@/utils/requestJSON";
import { Event } from "@/components";

export async function generateStaticParams(): Promise<any[]> {
	const events: Event[] = (await fetchJSON(
		`${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/event/getAll`,
	)) as Event[];
	return events.map((event) => ({
		eventId: event.id.toString(),
	}));
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
