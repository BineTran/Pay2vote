import React from "react";
import { FileUpload } from "../utils/FileUpload";
import { SettingSection } from "../utils/SettingSection";

export const AddTeamAvatar = () => {
	return (
		<SettingSection>
			<SettingSection.Header>Upload team&apos;s avatar</SettingSection.Header>
			<div className="flex items-center justify-start">
				<FileUpload />
			</div>
		</SettingSection>
	);
};
