import { config } from "@/utils/config";
import { postJSON } from "@/utils/requestJSON";

export const ApiService = {
	uploadImage: async (file: File | null) => {
		if (!file) {
			throw new Error("File is not selected");
		}

		const formData = new FormData();
		formData.append("image", file);

		const response = await fetch(config.apiRoute.UPLOAD_IMAGE, {
			method: "POST",
			credentials: "include",
			body: formData,
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error.message || "Internal server error");
		}

		const data = await response.json();
		return data.filePath; // Remember to return the file path
	},

	createEvent: async (name: string, description: string, filePath: string) => {
		const event = {
			name,
			description,
			avatar_path: filePath,
		};
		await postJSON(config.apiRoute.CREATE_EVENT, event);
	},

	createTeam: async (name: string, description: string, eventId: number, filePath: string) => {
		const event = {
			name,
			description,
			event_id: eventId,
			avatar_name: filePath,
		};
		await postJSON(config.apiRoute.CREATE_TEAM_API, event);
	},
};
