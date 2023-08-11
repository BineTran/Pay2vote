import React from "react";
import { useRouter } from "next/navigation";
import { NormalButton } from "../ui/NormalButton";
import { toast } from "react-toastify";

export default function CloseButton() {
	const router = useRouter();
	const handleCloseClick = () => {
		toast.dismiss();
		router.back();
	};
	return (
		<>
			<NormalButton onClick={handleCloseClick} customGradientFromTo="from-gray-100 to-gray-500">
				Go back
			</NormalButton>
		</>
	);
}
