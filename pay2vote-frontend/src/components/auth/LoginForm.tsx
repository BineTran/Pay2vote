"use client";
import React, { useState } from "react";
import { loginRequest } from "@/utils/authRequest";
import { useForm } from "react-hook-form";
import { InputField } from "./InputField";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { CustomSubmitButton } from "./CustomSubmitButton";
import { useRedirectToHome } from "@/hooks/useRedirectToHome";

export interface UserForm {
	username: string;
	password: string;
}

interface FormProps {
	title: string;
	url: string;
}

export const LoginForm: React.FC<FormProps> = ({ title, url }) => {
	useRedirectToHome();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserForm>();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	// Router for navigating
	const router = useRouter();

	const onSubmit = async (data: UserForm) => {
		setIsLoading(true);

		try {
			const response = await loginRequest(url, data);
			// If login success, redirect to homepage
			if (response.user) {
				Cookies.set("user", response.user.id, { path: "/" });
				Cookies.set("username", response.user.username, { path: "/" });
				router.push("/");
			}
		} catch (error: any) {
			toast.error(`${error.message}`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-[500px] h-[500px] p-8 justify-around ">
			<p className="font-bold text-2xl text-center">{title}</p>
			<InputField
				name={"username"}
				type={"text"}
				register={register}
				validation={{ required: "Username is required" }}
				error={errors.username} // Pass error down to InputField component
			/>
			<InputField
				name={"password"}
				type={"password"}
				register={register}
				validation={{
					required: "Password is required",
					minLength: { value: 6, message: "Password should be at least 6 characters long" },
				}}
				error={errors.password}
			/>

			<div className="flex justify-center">
				<CustomSubmitButton title={title} isLoading={isLoading} />
			</div>
		</form>
	);
};
