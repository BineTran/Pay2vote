import React from "react";
import Image from "next/image";
import { Team } from "..";

export default function QRImage({ team }: { team: Team }) {
	return (
		<div className="relative aspect-square w-full">
			<Image src={team.url} alt="QR Code" fill={true} className="absolute" />
		</div>
	);
}
