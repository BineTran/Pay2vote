"use client";
import { CustomSubmitButton } from "@/components/auth/CustomSubmitButton";
import { InputField } from "@/components/auth/InputField";
import { useEventContext } from "@/hooks/useEventContext";
import { ApiService } from "@/utils/ApiService";
import { config } from "@/utils/config";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { mutate } from "swr";
import { ImageEditorModal } from "./ImageEditorModal";
import Image from "next/image";

interface TeamForm {
	name: string;
	description: string;
	event_id: number;
}

type onTeamCreatedProps = {
	onTeamCreated: () => void;
};

const useTeamForm = ({ onTeamCreated }: onTeamCreatedProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TeamForm>();
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);
	const { eventId } = useEventContext();
	const [imageEditorModalOpen, setImageEditorModalOpen] = useState(false);
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

	const onFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			const reader = new FileReader();
			reader.onload = () => {
				// The file reading is complete
				setFile(files[0]);
				setImageEditorModalOpen(true); // Open modal when file is selected
			};
			reader.onerror = () => {
				reader.abort();
				console.log("Problem parsing input file.");
			};
			reader.readAsDataURL(files[0]);
		}
	}, []);

	const onSubmit = handleSubmit(async (data: TeamForm) => {
		if (!file) {
			toast.error("Please select file to upload");
			return;
		}

		setError(null);
		setIsLoading(true);

		try {
			const filePath = await ApiService.uploadImage(file);
			if (!eventId) {
				toast.error("Error: No event id provided");
				return;
			}
			await ApiService.createTeam(data.name, data.description, eventId, filePath);
			toast.success("Team created successfully");
			// Tell swr to revalidate
			mutate(`${config.apiRoute.GET_ALL_QR_OF_EVENT}/${eventId}`);
			setIsSubmittedSuccessfully(true);
		} catch (error: any) {
			setError(`Error while creating team: ${error.message}`);
			setIsSubmittedSuccessfully(false);
		} finally {
			setIsLoading(false);
		}
	});

	useEffect(() => {
		if (isSubmittedSuccessfully) {
			onTeamCreated();
		}
	}, [isSubmittedSuccessfully, onTeamCreated]);

	return {
		file,
		setFile,
		error,
		register,
		errors,
		onFileChange,
		onSubmit,
		isLoading,
		imageEditorModalOpen,
		setImageEditorModalOpen,
		imagePreviewUrl,
		setImagePreviewUrl,
	};
};

interface AddTeamFormProps {
	title: string;
	onTeamCreated: () => void;
}

export const AddTeamForm = ({ title, onTeamCreated }: AddTeamFormProps) => {
	const {
		file,
		setFile,
		error,
		register,
		errors,
		onFileChange,
		onSubmit,
		isLoading,
		imageEditorModalOpen,
		setImageEditorModalOpen,
		imagePreviewUrl,
		setImagePreviewUrl,
	} = useTeamForm({ onTeamCreated });

	const onImageEdited = (editedImage: File) => {
		setFile(editedImage);
		setImageEditorModalOpen(false);
		setImagePreviewUrl(URL.createObjectURL(editedImage)); // Update image preview url
	};

	return (
		<form onSubmit={onSubmit}>
			<div className="flex flex-col gap-4 relative">
				{error && <div>Error: {error}</div>}
				<InputField
					register={register}
					name={"name"}
					type={"text"}
					validation={{ required: "Name of team is required" }}
					error={errors.name}
				/>
				<InputField
					register={register}
					name={"description"}
					type={"text"}
					validation={{ required: "Description of team is required" }}
					error={errors.description}
				/>
				<div>
					<label htmlFor="file-upload">File upload:</label>
					<input id={"file-upload"} type="file" onChange={onFileChange} className="mx-2" />
				</div>
				{imagePreviewUrl && (
					<div className="flex w-full justify-center">
						<div className="flex w-60 aspect-square relative">
							<Image src={imagePreviewUrl} alt="Preview" fill={true} className="absolute" />
						</div>
					</div>
				)}
				<ImageEditorModal
					isOpen={imageEditorModalOpen}
					setIsOpen={setImageEditorModalOpen}
					onImageEdited={onImageEdited}
					file={file}
				/>
				<div className="flex justify-center">
					<CustomSubmitButton title={title} isLoading={isLoading} />
				</div>
			</div>
		</form>
	);
};
