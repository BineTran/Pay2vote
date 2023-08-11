import React from "react";

interface CustomButtonProps {
	title: string;
	isLoading: boolean;
}

export const CustomSubmitButton = ({ title, isLoading }: CustomButtonProps) => {
	return (
		<button
			type="submit"
			disabled={isLoading}
			className={`items-center bg-green-500  text-white  font-bold py-2 px-6 rounded shadow-md border-2 border-green-500
                hover:bg-white hover:text-black hover:border-green-500 hover:shadow-lg
                transition-colors duration-200
                focus:outline-none focus:shadow-outline`}
		>
			{isLoading ? "Loading..." : title}
		</button>
	);
};
