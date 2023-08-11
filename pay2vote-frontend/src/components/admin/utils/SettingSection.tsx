import React, { FC, PropsWithChildren, memo } from "react";
import { Skeleton } from "../../ui/Skeleton";

type SettingComposition = FC<PropsWithChildren> & {
	Header: FC<HeaderProps>;
	Skeleton: FC<SkeletonProps>;
};

const SettingSectionComponent: FC<PropsWithChildren> = ({ children }) => {
	return (
		<>
			<div
				className="flex flex-col gap-4 p-6 border-b border-1 border-favoriteGray/20"
				style={{ boxShadow: "0 4px 2px -2px rgba(128, 128, 128, 0.1)" }}
			>
				{children}
			</div>
		</>
	);
};

type HeaderProps = {
	children: React.ReactNode;
};

const HeaderComponent: FC<HeaderProps> = function Header({ children }) {
	return <p className="text-2xl font-semibold ">{children}</p>;
};

type SkeletonProps = {
	children?: React.ReactNode;
};

const SkeletonComponent: FC<SkeletonProps> = function SkeletonComponent() {
	return (
		<>
			<SettingSectionComponent>
				<Skeleton count={1} width="w-12" />
				<Skeleton count={1} width="w-full py-4" height="h-24" />
			</SettingSectionComponent>
		</>
	);
};

const MemoizedSettingSection = memo(SettingSectionComponent);
const MemoizedHeader = memo(HeaderComponent);
const MemoizedSkeleton = memo(SkeletonComponent);

export const SettingSection: SettingComposition = MemoizedSettingSection as any;
SettingSection.Header = MemoizedHeader;
SettingSection.Skeleton = MemoizedSkeleton;
