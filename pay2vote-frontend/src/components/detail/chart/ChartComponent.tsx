"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ListBoxWrapper from "./ListBoxWrapper";
import {
	typeDataset,
	typeDataTeam,
	options,
	pointTeam,
	formatDateTime,
	fetchAllPoint,
	getTimeLabels,
	formatHourToDateTime,
	formatMinuteToDateTime,
	formatData,
	getUniqueColor,
} from "@/components/utils/ChartSupport";
import useDataSWR from "@/hooks/useDataSWR";
import { toast } from "react-toastify";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Chart2({ eventID, allTeams }: { eventID: number; allTeams: typeDataTeam[] }) {
	const { data, isLoading, isError } = useDataSWR(
		`${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/pointTeam/getFirstTransPointCon/${eventID}`,
	);
	if (isError) {
		toast.error(`${isError}`);
	}

	const [labelsMinute, setLabelsMinute] = useState<string[]>([]);
	const [labelsHour, setLabelsHour] = useState<string[]>([]);
	const [labels, setLabels] = useState<string[]>(labelsHour);

	const [datasets, setDatasets] = useState<typeDataset[]>([]);
	const [dataHourGlobal, setDataHourGlobal] = useState<any[]>([]);
	const [dataMinuteGlobal, setDataMinuteGlobal] = useState<any[]>([]);

	const updateLabelAndPoint = useCallback(
		async (label: string[], formatter?: string) => {
			const now = new Date();
			const { hours, minutes } = { hours: now.getHours(), minutes: now.getMinutes() };
			const currentTime = formatter === "hour" ? hours : minutes;
			if (formatter === "hour" || currentTime % 5 === 0) {
				setLabels((prevLabels) => [
					...prevLabels,
					formatter === "hour"
						? `${String(currentTime).padStart(2, "0")}h`
						: `${hours}:${String(currentTime).padStart(2, "0")}`,
				]);
			}
			const time = formatDateTime(now);
			const limit = allTeams.length;
			const allPoint: pointTeam[] = await fetchAllPoint(eventID, time, limit);
			let newData: any;
			if (formatter === "hour") {
				newData = [...dataHourGlobal];
			} else {
				newData = [...dataMinuteGlobal];
			}
			allPoint.map((teamPoint: pointTeam, index) => {
				if (newData[index]) {
					newData[index].push(teamPoint.point);
				}
			});

			const newDataset = [...datasets];
			newDataset.map((item, index) => {
				item.data = newData[index];
			});
			setDatasets(newDataset);

			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[eventID, datasets, allTeams],
	);

	useEffect(() => {
		if (!isLoading) {
			const hour = getTimeLabels([], 2, data, "hour");
			const minute = getTimeLabels([], 5, data);
			setLabelsHour(hour);
			setLabelsMinute(minute);
			setLabels(hour);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	useEffect(() => {
		if (labelsHour.length > 0 && labelsMinute.length > 0) {
			let isMounted = true;
			const initDatasets = async () => {
				if (!isMounted) return;
				const limit = allTeams.length;
				const [dataHour, dataMinute] = await Promise.all([
					Promise.all(labelsHour.map((item) => fetchAllPoint(eventID, formatHourToDateTime(item), limit))),
					Promise.all(
						labelsMinute.map((item) => fetchAllPoint(eventID, formatMinuteToDateTime(item), limit)),
					),
				]);
				const formattedDataHour = formatData(dataHour);
				const formattedDataMinute = formatData(dataMinute);
				setDataHourGlobal(formattedDataHour);
				setDataMinuteGlobal(formattedDataMinute);
				const newDataset = allTeams.map((team: typeDataTeam, index) => ({
					label: team.name,
					data: formattedDataHour[index],
					borderColor: getUniqueColor(team.id, index, 1),
					backgroundColor: getUniqueColor(team.id, index, 0.5),
				}));
				setDatasets(newDataset);
			};
			initDatasets();
			return () => {
				isMounted = false;
			};
		}
	}, [eventID, allTeams, labelsHour, labelsMinute]);

	useEffect(() => {
		const intervalMinute = setInterval(() => updateLabelAndPoint(labelsMinute, "minute"), 60000);
		const intervalHour = setInterval(() => updateLabelAndPoint(labelsHour, "hour"), 3600000);

		return () => {
			clearInterval(intervalMinute);
			clearInterval(intervalHour);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [updateLabelAndPoint]);

	const dataChart = { labels, datasets };
	return (
		<div
			style={{ height: "auto", width: "100%", display: "flex", alignItems: "center" }}
			className="flex flex-col gap-4"
		>
			<ListBoxWrapper
				datasets={datasets}
				setLabels={setLabels}
				dataHourGlobal={dataHourGlobal}
				dataMinuteGlobal={dataMinuteGlobal}
				setDatasets={setDatasets}
				labelsHour={labelsHour}
				labelsMinute={labelsMinute}
			></ListBoxWrapper>
			<div className="bg-white rounded-2xl w-full p-4">
				<Line options={options} data={{ ...dataChart }} />
			</div>
		</div>
	);
}
