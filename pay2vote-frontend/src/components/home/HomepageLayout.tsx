import React, { PropsWithChildren } from "react";

type HomepageLayoutProps = {
	children?: React.ReactNode;
};

type CompoundComponent = React.FC<HomepageLayoutProps> & {
	Title: React.FC<PropsWithChildren>;
	ListEventContainer: React.FC<PropsWithChildren>;
};

export const HomepageLayout: CompoundComponent = ({ children }: PropsWithChildren) => {
	return (
		/* Container */
		<div className="flex w-full min-h-[80vh] justify-center items-start p-6">
			<div className="flex flex-col min-h-[calc(80vh*5/6)] w-5/6  justify-start ">
				<div className="flex flex-col justify-evenly h-full w-full pb-10">{children}</div>
			</div>
		</div>
	);
};

HomepageLayout.Title = function Title({ children }: PropsWithChildren) {
	return (
		/* Title  */
		<div className="flex w-11/12 justify-around">
			<div className="flex flex-row justify-start my-2 w-11/12 pl-2">
				<div className="text-4xl text-black font-semibold">{children}</div>
			</div>
		</div>
	);
};

HomepageLayout.ListEventContainer = function ListEventContainer({ children }: PropsWithChildren) {
	return (
		/* List of events container (outside) */
		<div className="flex justify-center">
			<div className="grid grid-cols-3 gap-12 min-h-[40vh] w-11/12">{children}</div>
		</div>
	);
};
