import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
	title: "Pay 2 Vote",
	description: "Pay to vote your favorite team in your loved events",
	applicationName: "Pay2Vote",
	author: [{ name: "Hung" }, { name: "Bien" }],
	icons: {
		icon: "/public/favicon.ico",
	},
	keywords: ["Pay2Vote", "PayToVote", "CASSO", "Vercel", "Next.js", "React.js"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body
				className={
					"bg-gradient-to-r from-cyan-500/60  via-violet-300/60 to-cyan-500/60 background-animate min-h-screen overflow-x-hidden "
				}
			>
				{/* <Navbar /> */}
				{children}
				<ToastContainer />
			</body>
		</html>
	);
}
