import { logger } from '@/utils/logger';
import { getAllPriceByEventId } from '../models/priceModel';
import { getTransAmountByEventId } from '../models/transModel';

interface RawVote {
	team_id: number;
	transaction_id: number;
	amount: number;
}

interface Vote extends RawVote {
	points: number;
	remaining_amount: number;
}

interface Price {
	price: number;
	point: number;
}

export interface TeamPoints {
	team_id: number;
	points: number;
}

interface Accumulator {
	[team_id: number]: number;
}

/**
 * Calculates and assigns points based on given price tiers.
 *
 * @param {number} amount - The vote amount
 * @param {Price[]} priceList - An array of not sorted Price objects each containing a `price`
 * and corresponding `point`.
 * @returns {number} - The total points calculated for the given vote.
 */
export const calculateVotePoints = (amount: number, priceList: Price[]) => {
	let remainingAmount = amount;
	let totalPoints = 0;

	// Sort price list in descending order
	priceList.sort((a: Price, b: Price) => b.price - a.price);

	for (const price of priceList) {
		if (remainingAmount >= price.price) {
			const quantity = Math.floor(remainingAmount / price.price);
			remainingAmount %= price.price;
			totalPoints += quantity * price.point;
		}
	}

	return { points: totalPoints, remaining_amount: remainingAmount };
};

/**
 * Accumulates votes for each team by summing up their total points.
 *
 * @param {Accumulator} accumulator - An object with `team_id` as keys and their respective
 *  points as values.
 * @param {Vote} currentVote - The current Vote object during the reduction.
 * @returns {Accumulator} - The updated accumulator object with `team_id` as keys and
 *  their respective points as values.
 */
export const accumulateVote = (accumulator: Accumulator, currentVote: Vote) => {
	// If team_id is not yet a key in the accumulator object
	if (!accumulator[currentVote.team_id]) {
		accumulator[currentVote.team_id] = currentVote.points as number;
	} else {
		accumulator[currentVote.team_id] += currentVote.points as number;
	}
	// Return accumulator for the next iteration
	return accumulator;
};

/**
 * Fetches the vote and price lists based on the given `eventId`, calculates points
 *  for each vote, accumulates the votes for each team, and returns the final result.
 *
 * @param {number} eventId - The ID of the event.
 * @returns {Promise<TeamPoints[]>} - A Promise that resolves to an array of TeamPoints
 *  objects with `team_id` and their total `points`.
 */
export const calculatePoints = async (eventId: number): Promise<TeamPoints[]> => {
	// First get array of Vote
	const voteList: RawVote[] = await getTransAmountByEventId(eventId);

	// Then get the price
	const priceList: Price[] = await getAllPriceByEventId(4);

	// Iterate over the vote
	const updatedVotes: Vote[] = voteList.map((vote: RawVote) => ({
		...vote,
		...calculateVotePoints(vote.amount, priceList),
	}));

	// Group team_id and sum total points
	const voteAccumulator = updatedVotes.reduce(accumulateVote, {});

	const resultArray: TeamPoints[] = Object.entries(voteAccumulator).map(([team_id, points]) => ({
		team_id: parseInt(team_id),
		points: points as number,
	}));

	const beautifiedTeamObject = resultArray.reduce((obj: { [key: string]: number }, team) => {
		obj[`Team ${team.team_id}`] = team.points;
		return obj;
	}, {});
	logger.info(beautifiedTeamObject, 'Team points updated');
	return resultArray;
};
