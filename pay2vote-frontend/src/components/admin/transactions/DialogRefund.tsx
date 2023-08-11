import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { closeModal } from "./TableTrans";
import { toast } from "react-toastify";
import Spinner from "@/components/ui/Spinner";
import { mutate } from "swr";
import { config } from "@/utils/config";
import { useEventContext } from "@/hooks/useEventContext";
import { fetchJSON } from "@/utils/requestJSON";
import { io } from "socket.io-client";

interface ChildComponentProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	url: string;
	id: number;
}

export const DialogTransition = ({ isOpen, setIsOpen, url }: ChildComponentProps) => {
	const { eventId } = useEventContext();
	const [spinner, setSpinner] = useState(false);
	useEffect(() => {
		const newSocket = io(config.development ? "http://localhost:5001" : config.serverDomain, {
			path: config.socketServerPath,
		});

		newSocket.on("status_refund", (result: any) => {
			if (result.status === "failed") {
				toast.error(result.message);
			} else {
				toast.success(result.message);
			}
			mutate([`${config.apiRoute.GET_INVALID_TRANSACTIONS_BY_EVENT_ID}/${eventId}`, eventId]);
		});

		// Return a cleanup function
		return () => {
			newSocket.close();
		};
	}, [eventId]);
	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				onClose={() => {
					closeModal(setIsOpen);
				}}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
									Refund Transactions
								</Dialog.Title>
								<div className="mt-2">
									<p className="text-sm text-gray-500">
										This amount will be refunded to the sender. We will notify you when the
										transaction is successful.
									</p>
								</div>

								<div className="mt-4 flex justify-end space-x-4">
									<button
										type="button"
										className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
										onClick={async () => {
											setSpinner(true);
											try {
												const response = await fetchJSON(url);
												if (response) {
													toast.success(response.message);
													mutate([
														`${config.apiRoute.GET_INVALID_TRANSACTIONS_BY_EVENT_ID}/${eventId}`,
														eventId,
													]);
												}
											} catch (error) {
												toast.error("Error when starting refund process");
											}

											setSpinner(false);
											closeModal(setIsOpen);
										}}
									>
										{!spinner ? (
											<p>Confirm!</p>
										) : (
											<div className="px-4">
												<Spinner width={5} height={5} />
											</div>
										)}
									</button>
									<button
										type="button"
										className="inline-flex justify-center rounded-md border border-transparent border-slate-400 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
										onClick={async () => {
											closeModal(setIsOpen);
										}}
									>
										Cancel
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};
