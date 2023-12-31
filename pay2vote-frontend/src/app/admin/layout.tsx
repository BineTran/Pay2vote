import { MainAdminComponent } from "@/components/admin/MainAdminComponent";
import { MainHeader } from "@/components/admin/MainHeader";
import Navbar from "@/components/nav/Navbar";
import { Suspense } from "react";

export const metadata = {
	title: "Pay 2 Vote",
	description: "Generated by create next app",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={<></>}>
			<MainAdminComponent navbar={<Navbar />} header={<MainHeader />}>
				{children}
			</MainAdminComponent>
		</Suspense>
	);
}
