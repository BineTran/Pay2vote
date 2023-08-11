import { fetchJSON } from "@/utils/requestJSON";

export interface typeDataset {
	label: string;
	data: number[];
	borderColor: string;
	backgroundColor: string;
}

export interface typeDataTeam {
	id: number;
	name: string;
	description: string;
	avatar_name: string;
	event_id: number;
	created_at: string;
	updated_at: string;
}

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top" as const,
		},
	},
	aspectRatio: 2,
	transitions: {
		show: {
			animations: {
				x: { from: 0 },
				y: { from: 0 },
			},
		},
		hide: {
			animations: {
				x: { to: 0 },
				y: { to: 0 },
			},
		},
	},
};

export interface pointTeam {
	id: number;
	point: number;
	event_id: number;
	team_id: number;
	create_at: string;
	updated_at: string;
}

export interface timeFirstPoint {
	created_at: string;
}

export const fetchAllTeam = async (): Promise<typeDataTeam[]> => {
	const allTeam: typeDataTeam[] = (await fetchJSON(
		`${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/team/getAll`,
	)) as typeDataTeam[];
	return allTeam;
};

export const fetchAllPoint = async (eventID: number, time: string, limit: number): Promise<pointTeam[]> => {
	const allPoint2: pointTeam[] = (await fetchJSON(
		`${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/pointTeam/getPoint/${eventID}/${time}/${limit}`,
	)) as pointTeam[];
	return allPoint2;
};

export const formatDateTime = (date: Date) => {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add 1 since getMonth() returns 0-11
	const day = date.getDate().toString().padStart(2, "0");
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const seconds = date.getSeconds().toString().padStart(2, "0");
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

function compareDates(dateString1: any, dateString2: any): number {
	const date1 = new Date(dateString1);
	const date2 = new Date(dateString2);

	const year1 = date1.getFullYear();
	const month1 = date1.getMonth() + 1; // Note: Months are zero-based, so we add 1 to get the correct month.
	const day1 = date1.getDate();

	const year2 = date2.getFullYear();
	const month2 = date2.getMonth() + 1;
	const day2 = date2.getDate();

	// Compare the year, month, and day components
	if (year1 > year2) {
		return 1;
	} else if (year1 < year2) {
		return -1;
	}

	if (month1 > month2) {
		return 1;
	} else if (month1 < month2) {
		return -1;
	}

	if (day1 > day2) {
		return 1;
	} else if (day1 < day2) {
		return -1;
	}

	// If the dates have the same year, month, and day, return 0 (equal)
	return 0;
}

export const getTimeLabels = (
	labels: string[],
	interval: number,
	dataFirst: timeFirstPoint[],
	formatter?: string,
): string[] => {
	try {
		const startDate = new Date(dataFirst[0].created_at);
		const now = new Date();
		const compareDay = compareDates(startDate, now);
		if (compareDay === -1) {
			const now = new Date();
			const { hours, minutes } = { hours: now.getHours(), minutes: now.getMinutes() };
			const currentTime = formatter === "hour" ? hours : minutes;
			for (let i = 0; i <= currentTime; i += interval) {
				labels.push(
					formatter === "hour" ? `${String(i).padStart(2, "0")}h` : `${hours}:${String(i).padStart(2, "0")}`,
				);
			}
			return labels;
		} else {
			if (formatter === "hour") {
				let startHour = startDate.getHours();
				if (startDate.getMinutes() > 0) {
					startHour += 1;
				}
				for (let i = startHour; i <= now.getHours(); i += interval) {
					labels.push(`${String(i).padStart(2, "0")}h`);
				}
			} else {
				if (startDate.getHours() === now.getHours()) {
					const startDateMinutes = startDate.getHours() * 60 + startDate.getMinutes();
					const nowMinutes = now.getHours() * 60 + now.getMinutes();
					for (let i = startDateMinutes; i <= nowMinutes; i += interval) {
						const hours = Math.floor(i / 60);
						const minutes = i % 60;
						labels.push(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
					}
				} else {
					const currentMinutes = now.getMinutes();
					for (let i = 0; i <= currentMinutes; i += interval) {
						labels.push(`${String(now.getHours()).padStart(2, "0")}:${String(i).padStart(2, "0")}`);
					}
				}
			}
		}
		return labels;
	} catch (error: any) {
		console.log(error);
		return [""];
	}
};

export const formatHourToDateTime = (hourString: string): string => {
	const now = new Date();
	const year = now.getFullYear();
	const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Add 1 since getMonth() returns 0-11
	const day = now.getDate().toString().padStart(2, "0");
	const hours = hourString.slice(0, -1).padStart(2, "0");
	return `${year}-${month}-${day} ${hours}:00:00`;
};

export const formatMinuteToDateTime = (minuteString: string): string => {
	const now = new Date();
	const year = now.getFullYear();
	const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Add 1 since getMonth() returns 0-11
	const day = now.getDate().toString().padStart(2, "0");
	return `${year}-${month}-${day} ${minuteString}:00`;
};

export const formatData = (data: any[]) => {
	const result = [];
	for (let i = 0; i < data[0].length; i++) {
		const tempArray = data.map((subArray) => subArray[i].point);
		result.push(tempArray);
	}
	return result;
};

export const getUniqueColor = (id: number, index: number, alpha: number): string => {
	const r = ((id + index) * 123) % 255; // generate 'r' value
	const g = ((id + index) * 231) % 255; // generate 'g' value
	const b = ((id + index) * 143) % 255; // generate 'b' value
	return `rgba(${r},${g},${b},${alpha})`;
};
