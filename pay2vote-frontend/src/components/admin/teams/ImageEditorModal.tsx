import React, { useCallback, useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { DialogWrapper } from "./DialogWrapper";

type ImageEditorModalProps = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void; // A set state passed in here
	onImageEdited: (image: File) => void;
	file: File | null;
};

export const ImageEditorModal = ({ isOpen, setIsOpen, onImageEdited, file }: ImageEditorModalProps) => {
	const [image, setImage] = useState<any>();
	const editorRef = useRef<AvatarEditor | null>(null);
	const [zoom, setZoom] = useState(1);

	const handleImage = (file: File | null) => {
		if (file) {
			const reader = new FileReader();
			reader.onload = (e: ProgressEvent<FileReader>) => {
				const target = e.target as FileReader;
				if (target && typeof target.result === "string") {
					setImage(target.result);
				}
			};
			reader.onerror = () => {
				reader.abort();
				console.log("Problem in parsing image.");
			};
			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		handleImage(file);
	}, [file]);

	const handleEdit = useCallback(() => {
		if (editorRef.current) {
			const canvas = editorRef.current.getImageScaledToCanvas();
			canvas.toBlob((blob) => {
				if (blob) {
					onImageEdited(new File([blob as Blob], "avatar.png", { type: "image/png" }));
					setIsOpen(false);
				}
			});
		}
	}, [onImageEdited, setIsOpen]);

	const handleZoomChange = (event: any) => {
		setZoom(event.target.value);
	};

	return (
		<>
			<DialogWrapper isOpen={isOpen} setIsOpen={() => setIsOpen(false)} title={"Edit your image"}>
				{image && (
					<>
						<div className="flex w-full justify-center items-center">
							<AvatarEditor
								ref={editorRef as any}
								image={image}
								width={250}
								height={250}
								border={50}
								color={[255, 255, 255, 0.6]}
								scale={zoom}
							/>
						</div>

						<label htmlFor="zoom">Zoom: </label>
						<input
							id="zoom"
							type="range"
							min="1"
							max="3"
							step="0.01"
							value={zoom}
							onChange={handleZoomChange}
						/>
					</>
				)}
				<button onClick={handleEdit}>Save Image</button>
			</DialogWrapper>
		</>
	);
};
