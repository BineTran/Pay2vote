import React from "react";
import { useState } from "react";
import Image from "next/image";
import Spinner from "../ui/Spinner";

export default function Modal({ url }: { url: string }) {
	const [showModal, setShowModal] = useState(false);
	const [showQR, setShowQR] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleClick = async () => {
		setLoading(true);

		setTimeout(() => {
			setLoading(false);
			setShowModal(true);
			setShowQR(true);
		}, 500);
	};

	return (
		<>
			<button
				className=" w-full bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
				type="button"
				onClick={handleClick}
			>
				{loading ? <Spinner /> : "VOTE"}
			</button>
			{showModal ? (
				<>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
						<div className="relative w-auto my-6 mx-auto max-w-3xl">
							{/*content*/}
							<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
								{/*header*/}
								<div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
									<h3 className="text-3xl font-semibold">QR Code</h3>
									<button
										className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
										onClick={() => setShowModal(false)}
									>
										<span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"></span>
									</button>
								</div>
								{/*body*/}
								<div className="relative p-6 flex-auto">
									{showQR && <Image src={url} alt="QR Code" width={500} height={500} />}
								</div>
								{/*footer*/}
								<div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
									<button
										className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none ease-linear transition-all duration-150"
										type="button"
										onClick={() => setShowModal(false)}
									>
										HUỶ
									</button>
									<button
										className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
										type="button"
										onClick={() => setShowModal(false)}
									>
										TÔI ĐÃ CHUYỂN KHOẢN
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
				</>
			) : null}
		</>
	);
}
