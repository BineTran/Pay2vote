"use client";
import React, { useRef } from "react";
import { Team, TeamPoints } from "..";
import AvaQrPointItems from "./AvaQrPointItems";
import { Pagination, EffectCoverflow, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

export default function SwiperCompo({
	allTeam,
	check,
	teamsPoints,
	eventID,
	teamNameActive,
}: {
	allTeam: Team[];
	check: boolean;
	teamsPoints: TeamPoints[] | null;
	eventID: number;
	teamNameActive: string | null;
}) {
	const slidesPerView = allTeam
		? allTeam.length > 3
			? 2
			: allTeam.length === 3
			? 1
			: allTeam.length === 2
			? 1
			: 0
		: 0;

	const progressCircle = useRef<SVGSVGElement>(null);
	const progressContent = useRef<HTMLSpanElement>(null);
	const onAutoplayTimeLeft = (s: any, time: any, progress: any) => {
		if (progressCircle.current && progressContent.current) {
			progressCircle.current.style.setProperty("--progress", (1 - progress).toString());
			progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
		}
	};
	return (
		<>
			<Swiper
				effect={"coverflow"}
				spaceBetween={50}
				grabCursor={true}
				centeredSlides={true}
				loop={true}
				slidesPerView={slidesPerView}
				autoplay={{
					delay: 5000,
					disableOnInteraction: false,
				}}
				coverflowEffect={{
					rotate: 20,
					stretch: 450,
					depth: 300,
					modifier: 1,
				}}
				pagination={true}
				modules={[Autoplay, EffectCoverflow, Pagination]}
				onSwiper={(swiper) => console.log(swiper)}
				onSlideChange={() => console.log("slide change")}
				onAutoplayTimeLeft={onAutoplayTimeLeft}
			>
				{allTeam.map((team, index) => (
					<SwiperSlide key={index}>
						<AvaQrPointItems
							index={index}
							team={team}
							check={check}
							teamsPoints={teamsPoints}
							eventID={eventID}
							teamNameActive={teamNameActive}
						/>
					</SwiperSlide>
				))}
				{slidesPerView && slidesPerView > 0 ? (
					<div
						className="autoplay-progress absolute right-4 bottom-4 z-10 w-12 h-12 flex items-center justify-center text-swiper-theme-color"
						slot="container-end"
					>
						<svg
							viewBox="0 0 48 48"
							ref={progressCircle}
							className="absolute top-0 left-0 z-10 w-full h-full transform -rotate-90"
						>
							<circle
								cx="24"
								cy="24"
								r="20"
								className="stroke-current fill-transparent"
								style={{
									strokeWidth: "4px",
									strokeDashoffset: "calc(125.6 * (1 - var(--progress)))",
									strokeDasharray: "125.6",
								}}
							/>
						</svg>
						<span ref={progressContent}></span>
					</div>
				) : null}
			</Swiper>
		</>
	);
}
