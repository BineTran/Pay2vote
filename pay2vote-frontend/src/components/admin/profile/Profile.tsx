"use client";
import React, { useState } from "react";
import LinkAccountBox, { FIAccountType } from "../utils/LinkAccountBox";
import { AccountInfo } from "../utils/AccountInfo";
import { SettingSection } from "../utils/SettingSection";

export const Profile = () => {
	const [activeAccountType, setActiveAccountType] = useState<FIAccountType | null>(null);
	return (
		<>
			<div className="flex flex-col gap-4">
				<SettingSection>
					<SettingSection.Header>Your bank account&apos;s status</SettingSection.Header>
					<LinkAccountBox
						accountType="normal"
						title="Link your account"
						isActive={activeAccountType === "normal"}
						onLink={setActiveAccountType}
					/>
					<LinkAccountBox
						accountType="refund"
						title="Link your refund account"
						isActive={activeAccountType === "refund"}
						onLink={setActiveAccountType}
					/>
				</SettingSection>

				<SettingSection>
					<SettingSection.Header>Account information</SettingSection.Header>
					<div className="flex flex-row w-full gap-4 pt-4">
						<div className="flex flex-col w-1/2 gap-4">
							<p className=" font-semibold text-lg">Normal account</p>
							<AccountInfo accountType="normal" />
						</div>
						<div className="flex flex-col w-1/2 gap-4">
							<p className=" font-semibold text-lg">Refund account</p>
							<AccountInfo accountType="refund" />
						</div>
					</div>
				</SettingSection>
			</div>
		</>
	);
};
