import React, { memo } from "react";

interface AccountPropertyProps {
	children: React.ReactNode;
}

export const AccountProperty: React.FC<AccountPropertyProps> = memo(function AccountProperty({ children }) {
	return (
		<div className="w-full border-2 px-4 py-4 mx-auto rounded-md border-green-100/50 bg-gray-100/50 hover:border-green-400 hover:bg-white transition-colors duration-300 cursor-default hover:text-green-500 font-semibold ">
			{children}
		</div>
	);
});

export interface UserInfo {
	username: string | null;
	name: string | null;
	account_number: string | null;
	account_name: string | null;
}

interface AccountPanelProps {
	children: React.ReactNode;
}

export const AccountInfoBox: React.FC<AccountPanelProps> = ({ children }) => {
	return (
		<div className="mx-auto p-5  rounded-md border-2 border-green-100/50 bg-white shadow-lg hover:cursor-default">
			<h1 className="text-lg font-bold ">Account Information</h1>
			{children}
		</div>
	);
};
