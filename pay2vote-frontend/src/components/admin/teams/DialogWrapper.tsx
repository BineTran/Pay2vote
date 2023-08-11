import React, { Fragment, ReactNode, memo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AiOutlineClose } from "react-icons/ai";

interface DialogWrapperProps {
	isOpen: boolean;
	setIsOpen: () => void;
	children: ReactNode;
	title: string;
	description?: string;
}

export const DialogWrapper = memo(function DialogWrapper({
	isOpen,
	setIsOpen,
	children,
	title,
	description,
}: DialogWrapperProps) {
	return (
		<div className="relative">
			<Transition appear show={isOpen}>
				<Dialog as={"div"} open={isOpen} onClose={() => setIsOpen()} className={"relative z-10"}>
					{/* Blurred gradient background  */}
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 z-50 bg-gradient-to-r from-cyan-500/20  to-violet-300/20" />
					</Transition.Child>

					{/* Outer white box of add team form  */}
					<div className="fixed inset-0 z-50 overflow-y-auto">
						{/* Inner content  */}
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
								<Dialog.Panel className="w-full flex flex-col gap-6 max-w-md min-h-[50vh] max-h-full transform overflow-auto bg-white p-6 text-left align-middle shadow-xl transition-all">
									{/* Title and close button  */}
									<div className="flex flex-row justify-center items-center relative">
										<Dialog.Title as={"h1"} className={"text-2xl font-semibold text-center "}>
											{title}
										</Dialog.Title>

										<button className="absolute right-0" onClick={() => setIsOpen()}>
											<AiOutlineClose className="w-6 h-6 text-gray-500" />
										</button>
									</div>

									<Dialog.Description>{description}</Dialog.Description>
									{children}
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	);
});
