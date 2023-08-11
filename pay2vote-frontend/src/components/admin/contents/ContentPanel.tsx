import { FC, memo } from "react";

interface ContentPanelProps {
	children: React.ReactNode;
}

// This is the content panel layout for admin page
export const ContentPanel: FC<ContentPanelProps> = memo(function ContentPanel({ children }) {
	return (
		<div
			className="bg-white w-full h-full py-2 px-4
        rounded-br-md shadow-xl 
        border border-gray-500/50  overflow-y-auto"
		>
			{children}
		</div>
	);
});
