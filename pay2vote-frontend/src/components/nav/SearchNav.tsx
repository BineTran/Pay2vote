"use client";
import { useRouter } from "next/navigation";
import { EventCombobox } from "./EventCombobox";
import { Event } from "..";
import { memo } from "react";

const SearchNav = memo(function SearchNav() {
	const router = useRouter();

	const handleSelection = (value: Event) => {
		router.push(`/event/${value.id}`);
	};

	return (
		<>
			<EventCombobox handleSelection={handleSelection} />
		</>
	);
});
export default SearchNav;
