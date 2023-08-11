"use client";
import React, { memo } from "react";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { AiOutlineSearch } from "react-icons/ai";
import useDataSWR from "@/hooks/useDataSWR";
import { toast } from "react-toastify";
import { Skeleton } from "../ui/Skeleton";
import { config } from "@/utils/config";
import { Event } from "..";

interface EventComboboxProps {
	handleSelection: (value: Event) => void;
	className?: string;
	url?: string;
}

export const EventComboboxSkeleton = () => {
	return <Skeleton count={1} width="w-[15.2rem]" height="h-9" />;
};

export const SearchNavSkeleton = () => {
	return (
		<div className={"md:order-2 min-w-60 "}>
			<EventComboboxSkeleton />
		</div>
	);
};

// Do not fix the async or delete it at all cost, it will crash production
export const EventCombobox = memo(function EventCombobox({
	handleSelection,
	className,
	url = config.apiRoute.GET_ALL_EVENTS_API,
}: EventComboboxProps) {
	const [selected, setSelected] = useState<Event | null>(null);
	const [query, setQuery] = useState("");

	const { data, isLoading, isError } = useDataSWR(url);

	if (isError) {
		toast.error(`${isError}`);
	}

	const filteredPeople =
		query === ""
			? data
			: data.filter((event: Event) =>
					event.name.toLowerCase().replace(/\s+/g, "").includes(query.toLowerCase().replace(/\s+/g, "")),
			  );
	return isLoading ? (
		<SearchNavSkeleton />
	) : (
		<Combobox
			value={selected}
			onChange={(value: any) => {
				setSelected(value);
				handleSelection(value);
			}}
		>
			<div className="md:order-2">
				<div
					className={`relative w-full min-w-60  cursor-default overflow-hidden rounded-lg bg-white text-left shadow-sm border
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300
                 sm:text-sm flex justify-between ${className}`}
				>
					<Combobox.Input
						className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none"
						displayValue={(event: Event | null) => event?.name || ""}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search event..."
					/>
					<Combobox.Button className="inset-y-0 right-0 flex items-center pr-2">
						<AiOutlineSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
					</Combobox.Button>
				</div>
				<></>
				<Transition
					as={Fragment}
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					afterLeave={() => setQuery("")}
				>
					<Combobox.Options className="absolute z-50 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{!filteredPeople || (filteredPeople.length === 0 && query !== "") ? (
							<div className=" cursor-default select-none py-2 px-4 text-gray-700">Nothing found.</div>
						) : (
							filteredPeople.map((event: any) => (
								<Combobox.Option
									key={event.id}
									className={({ active }) =>
										` cursor-default select-none py-2 pl-10 pr-4 ${
											active ? "bg-blue-500 text-white" : "text-gray-900"
										}`
									}
									value={event}
								>
									{({ selected, active }) => (
										<>
											<span
												className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
											>
												{event.name}
											</span>
											{selected ? (
												<span
													className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
														active ? "text-white" : "text-teal-600"
													}`}
												></span>
											) : null}
										</>
									)}
								</Combobox.Option>
							))
						)}
					</Combobox.Options>
				</Transition>
			</div>
		</Combobox>
	);
});
