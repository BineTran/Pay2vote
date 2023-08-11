import React from "react";
import { FaCheck } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";

interface Props {
	accessToken: string | null;
}

const BankLinkedConfirm: React.FC<Props> = ({ accessToken }) => {
	return (
		<>
			{accessToken !== null ? (
				<div className="flex flex-row items-center">
					<p className="text-green-500 font-normal text-lg mr-1">Account linked</p>
					<FaCheck className="text-green-500" />
				</div>
			) : (
				<div className="flex flex-row items-center">
					<p className="text-red-500 font-normal text-lg mr-2">You have no linked account</p>
					<HiXMark className="text-red-500 font-extra text-2xl" />
				</div>
			)}
		</>
	);
};

export default BankLinkedConfirm;
