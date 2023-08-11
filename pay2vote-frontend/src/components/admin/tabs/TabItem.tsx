import { ReactElement, ReactNode, memo } from "react";

type TabItemLayoutProps = {
	onClick: () => void;
	children: ReactNode;
	active: boolean;
};

export const TabItemLayout = ({ onClick, children, active }: TabItemLayoutProps) => {
	const activeStyle = active
		? " bg-gradient-to-br from-purple-500 to-pink-500 text-white border border-white shadow-lg scale-x-110"
		: "";
	return (
		<div
			className={`${activeStyle} flex flex-row px-4 py-3 mt-4 mx-4 border border-gray-500/50 
            rounded-md shadow-md text-lg font-bold items-center gap-x-2
            cursor-pointer transition-all duration-300
            hover:bg-gradient-to-br hover: from-purple-500 hover: to-pink-500 hover:text-white  
            `}
			onClick={onClick}
		>
			{children}
		</div>
	);
};

interface TabItemPropType {
	name: string;
	icon: ReactElement;
	onClick: () => void;
	active: boolean;
}

export const TabItem = memo(function TabItem({ name, icon, onClick, active }: TabItemPropType) {
	const TabIcon = <div>{icon}</div>;
	const TabName = <div className="tracking-wide">{name}</div>;

	return (
		<TabItemLayout onClick={onClick} active={active}>
			{TabIcon}
			{TabName}
		</TabItemLayout>
	);
});
