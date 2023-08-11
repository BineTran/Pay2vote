import Spinner from "@/components/ui/Spinner";
import { useEventContext } from "@/hooks/useEventContext";
import { config } from "@/utils/config";
import { fetchJSON } from "@/utils/requestJSON";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { mutate } from "swr";

interface ChildComponentProps {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DialogRefundAll({ isOpen, setIsOpen }: ChildComponentProps) {
	const { eventId } = useEventContext();
	const [spinner, setSpinner] = useState(false);
	function closeModal() {
		setIsOpen(false);
	}
	useEffect(() => {
		const newSocket = io(config.development ? "http://localhost:5001" : config.serverDomain, {
			path: config.socketServerPath,
		});

		newSocket.on("status_refund_all", (result: any) => {
			if (result.status === "failed") {
				toast.error(result.message);
			} else {
				toast.success(result.message);
				mutate([`${config.apiRoute.GET_INVALID_TRANSACTIONS_BY_EVENT_ID}/${eventId}`, eventId]);
			}
			mutate([`${config.apiRoute.GET_INVALID_TRANSACTIONS_BY_EVENT_ID}/${eventId}`, eventId]);
		});

		// Return a cleanup function
		return () => {
			newSocket.close();
		};
	}, [eventId]);
	return (
		<>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={closeModal}>
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
										Refund All Transactions
									</Dialog.Title>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											All invalid transactions will be refunded. Are you sure about that?
										</p>
									</div>

									<div className="mt-4 flex justify-end space-x-4">
										<button
											type="button"
											className="inline-flex justify-center rounded-md border border-transparent bg-red-400 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
											onClick={async () => {
												setSpinner(true);
												try {
													const response: any = await fetchJSON(
														`${config.serverDomain}/api/v1/refund/eventID/${eventId}`,
													);
													if (response.message === "There are no transactions to refund!") {
														toast.warning(response.message);
													} else {
														toast.success(response.message);
													}
													mutate([
														`${config.apiRoute.GET_INVALID_TRANSACTIONS_BY_EVENT_ID}/${eventId}`,
														eventId,
													]);
												} catch (error: any) {
													mutate([
														`${config.apiRoute.GET_INVALID_TRANSACTIONS_BY_EVENT_ID}/${eventId}`,
														eventId,
													]);
												}

												setSpinner(false);
												closeModal();
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
												closeModal();
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
		</>
	);
}
