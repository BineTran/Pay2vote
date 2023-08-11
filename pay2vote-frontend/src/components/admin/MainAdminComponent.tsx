import React, { FC, Suspense, memo } from "react";
import { TabProvider } from "@/context/TabContext";
import { AdminContent } from "./AdminContent";
import { SkeletonAdmin } from "./utils/SkeletonAdmin";

interface MainAdminComponentProps {
	navbar: React.ReactNode;
	header: React.ReactNode;
	children: React.ReactNode;
}

export const MainAdminComponent: FC<MainAdminComponentProps> = memo(function MainAdminComponent({
	navbar,
	header,
	children,
}) {
	return (
		<Suspense fallback={<SkeletonAdmin />}>
			<TabProvider>
				<div className="flex flex-col h-screen">
					{navbar}
					<div className="flex items-center justify-center w-full h-full ">
						<div
							className="flex flex-wrap max-w-full h-full w-[90vw] overflow-hidden
						items-center justify-center 
						"
						>
							<div className="flex flex-col justify-center w-full h-full gap-4 mx-4">
								{/* This is the top header of the admin panel */}
								{header}
								{/* This is both side tab and its content  */}
								<div className="flex flex-row w-full h-[80vh] items-center gap-4">
									<AdminContent>{children}</AdminContent>
								</div>
							</div>
						</div>
					</div>
				</div>
			</TabProvider>
		</Suspense>
	);
});
