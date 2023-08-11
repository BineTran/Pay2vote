import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { AiOutlineCheck, AiOutlineUnorderedList } from "react-icons/ai";
import { typeDataset } from "@/components/utils/ChartSupport";

const people = [{ name: "Hour" }, { name: "Minute" }];

interface ChildComponentProps {
	datasets: typeDataset[];
	dataHourGlobal: any[];
	dataMinuteGlobal: any[];
	labelsMinute: string[];
	labelsHour: string[];
	setLabels: React.Dispatch<React.SetStateAction<string[]>>;
	setDatasets: React.Dispatch<React.SetStateAction<typeDataset[]>>;
}

export default function ListBoxWrapper({
	datasets,
	dataHourGlobal,
	dataMinuteGlobal,
	labelsMinute,
	labelsHour,
	setLabels,
	setDatasets,
}: ChildComponentProps) {
	const [selected, setSelected] = useState(people[0]);
	const handleSelection = (person: (typeof people)[0]) => {
		setSelected(person); // Update the state
		const newDataset = [...datasets];
		let newData: any;
		if (person.name === "Hour") {
			setLabels(labelsHour);
			newData = [...dataHourGlobal];
		} else {
			setLabels(labelsMinute);
			newData = [...dataMinuteGlobal];
		}
		newDataset.map((item, index) => {
			item.data = newData[index];
		});
		setDatasets(newDataset);
	};
	return (
		<div className="flex justify-center">
			<Listbox value={selected} onChange={handleSelection}>
				<div className="relative mt-1">
					<Listbox.Button className="relative cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
						<span className="block truncate font-bold">{selected.name}</span>
						<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
							<AiOutlineUnorderedList className="h-5 w-5 text-gray-400" aria-hidden="true" />
						</span>
					</Listbox.Button>
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Listbox.Options className="absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
							{people.map((person, personIdx) => (
								<Listbox.Option
									key={personIdx}
									className={({ active }) =>
										`relative cursor-default select-none py-2 pl-10 pr-4 ${
											active ? "bg-amber-100 text-amber-900" : "text-gray-900"
										}`
									}
									value={person}
								>
									{({ selected }) => {
										return (
											<>
												<span
													className={`block truncate ${
														selected ? "font-medium" : "font-normal"
													}`}
												>
													<div className="font-bold">{person.name}</div>
												</span>
												{selected ? (
													<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
														<AiOutlineCheck className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										);
									}}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</div>
	);
}
