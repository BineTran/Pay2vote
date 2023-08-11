"use client";

import React, { useState } from "react";

import { toast } from "react-toastify";

export const onFileUpload = async (
	file: File | null,
	setError: React.Dispatch<React.SetStateAction<string | null>>,
	teamId: number | null,
) => {
	if (!file) {
		toast.error("Please select file to upload");
		return;
	}

	//File now being upload
	setError(null);

	const formData = new FormData();
	formData.append("image", file);

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/v1/upload/team/${teamId}`, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		console.log("File Uploaded successfully");
	} catch (error: any) {
		setError(`Error while uploading file: ${error.message}`);
	}
};

export const onFileChange = (
	event: React.ChangeEvent<HTMLInputElement>,
	setFile: React.Dispatch<React.SetStateAction<File | null>>,
) => {
	const files = event.target.files;
	if (files) {
		setFile(files[0]);
	}
};

export const FileUpload: React.FC = () => {
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [teamId, setTeamId] = useState<number | null>(null);

	const onTeamIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTeamId(parseInt(e.target.value, 10));
	};

	return (
		<div className="flex flex-col gap-4">
			{error && <div>Error: {error}</div>}

			<div className="flex flex-col gap-4">
				<div>
					<label htmlFor="team-id">Team ID:</label>
					<input
						id={"team-id"}
						type="number"
						value={teamId || ""}
						onChange={onTeamIdChange}
						className="mx-2 rounded-lg border-2 border-gray-100/50 focus:outline-green-200"
					/>
				</div>

				<div>
					<label htmlFor="file-upload">File upload:</label>
					<input
						id={"file-upload"}
						type="file"
						onChange={(e) => {
							onFileChange(e, setFile);
						}}
						className="mx-2"
					/>
				</div>

				<button
					onClick={() => {
						onFileUpload(file, setError, teamId);
					}}
					className="mx-4 px-4 py-2 bg-green-500 font-bold text-white rounded-md shadow-md"
				>
					{file ? "Uploaded!" : "Upload"}
				</button>
			</div>
		</div>
	);
};
