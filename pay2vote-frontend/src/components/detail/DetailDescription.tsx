/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { typeDataTeam } from "../utils/ChartSupport";

type DetailDescriptionProps = {
	team: typeDataTeam;
};

export default function DetailDescription({ team }: DetailDescriptionProps) {
	// This function splits a text into sentences
	const extractSentences = (text: string): string[] => {
		// This regex matches any character that typically comes at the end of a sentence (.!?)
		// and splits the string at those characters.
		// eslint-disable-next-line no-useless-escape
		return text.match(/[^\.!\?]+[\.!\?]+/g) || [];
	};

	return (
		<div className="flex flex-col w-5/6 gap-4 justify-center items-center">
			<div className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text py-3 px-6 rounded text-2xl font-semibold text-transparent">
				{team.name}
			</div>

			<div>
				{extractSentences(team.description).map((sentence, index) => (
					<p key={index}>{sentence}</p>
				))}
			</div>
		</div>
	);
}
