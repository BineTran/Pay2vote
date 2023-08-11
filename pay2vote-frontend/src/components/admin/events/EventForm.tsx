import { CustomSubmitButton } from "@/components/auth/CustomSubmitButton";
import { InputField } from "@/components/auth/InputField";
import { ApiService } from "@/utils/ApiService";
import { config } from "@/utils/config";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { mutate } from "swr";
import Image from "next/image";
import { ImageEditorModal } from "../teams/ImageEditorModal";

type useEventFormProps = {
	onEventCreated: () => void;
};

interface EventFormFields {
	name: string;
	description: string;
}

const useEventForm = ({ onEventCreated }: useEventFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<EventFormFields>();
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isFormSubmittedSuccessful, setIsFormSubmittedSuccessful] = useState(false);
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

	const onSubmit = handleSubmit(async (data: EventFormFields) => {
		if (!file) {
			toast.error("Please select file to upload");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const filePath = await ApiService.uploadImage(file);

			await ApiService.createEvent(data.name, data.description, filePath);
			toast.success("Event created successfully");

			// Revalidate if add event success
			mutate(config.apiRoute.GET_EVENTS_OF_USER);
			setIsFormSubmittedSuccessful(true);
		} catch (error: any) {
			setError(`Error while creating event: ${error.message}`);
			toast.error(`Error while creating event: ${error.message}`);
			setIsFormSubmittedSuccessful(false);
		} finally {
			setIsLoading(false);
		}
	});

	useEffect(() => {
		if (isFormSubmittedSuccessful) {
			onEventCreated();
		}
	}, [isFormSubmittedSuccessful, onEventCreated]);

	return {
		file,
		setFile,
		error,
		errors,
		isLoading,
		register,
		onFileChange,
		onSubmit,
		imageEditorModalOpen,
		setImageEditorModalOpen,
		imagePreviewUrl,
		setImagePreviewUrl,
	};
};

type EventFormProps = {
	onEventCreated: () => void;
};

export const EventForm: React.FC<EventFormProps> = ({ onEventCreated }) => {
	const {
		file,
		setFile,
		error,
		register,
		errors,
		isLoading,
		onFileChange,
		onSubmit,
		imageEditorModalOpen,
		setImageEditorModalOpen,
		imagePreviewUrl,
		setImagePreviewUrl,
	} = useEventForm({
		onEventCreated,
	});

	const onImageEdited = (editedImage: File) => {
		setFile(editedImage);
		setImageEditorModalOpen(false);
		setImagePreviewUrl(URL.createObjectURL(editedImage)); // Update image preview url
	};

	return (
		<>
			<form onSubmit={onSubmit}>
				<div className="flex flex-col gap-4">
					{error && <div>Error: {error}</div>}

					<div className="flex flex-col gap-4">
						<InputField
							register={register}
							name="name"
							type="text"
							validation={{ required: "Name of the event is required" }}
							error={errors.name}
						/>
						<InputField
							register={register}
							name="description"
							type="text"
							validation={{ required: "Description of the event is required" }}
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
							<CustomSubmitButton title={"Submit"} isLoading={isLoading} />
						</div>
					</div>
				</div>
			</form>
		</>
	);
};
