import React from "react";
import { RegisterOptions, FieldError } from "react-hook-form";

interface InputFieldProps {
	register?: (...arg: any) => any;
	name: string;
	type: string;
	autoComplete?: string;
	validation?: RegisterOptions; // Optional for non react-hook-form
	error?: FieldError;
	value?: string | number; // Added for non react-hook-form usage
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Added for non react-hook-form usage
}
const formatString = (str: string): string => {
	return str
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export const InputField: React.FC<InputFieldProps> = ({
	register,
	name,
	type,
	autoComplete = "off",
	validation,
	error,
	value,
	onChange,
}) => {
	const labelClass = "block text-gray-700 focus:text-green-300 text-xl font-bold mb-2";
	const baseClass = `shadow appearance-none border rounded w-full py-3 px-4 mb-2 text-gray-700 text-xl leading-tight hover:shadow-md
    focus:outline-none focus:shadow-outline focus:border-green-300`;
	const errorClass = error ? "border-red-500 focus:border-red-700" : "";
	const capitalizedName = formatString(name);
	const errorText = "absolute text-red-500 text-xs italic";

	// Use register props for formik forms, otherwise use value and onChange
	const inputProps = register ? register(name, validation) : { value, onChange };

	return (
		<div className="mb-2">
			<label htmlFor={name} className={labelClass}>
				{capitalizedName}
			</label>
			<input
				id={name}
				type={type}
				autoComplete={autoComplete}
				{...inputProps}
				className={`${baseClass} ${errorClass}`}
			/>
			{error && <div className={errorText}>{error.message}</div>}
		</div>
	);
};
