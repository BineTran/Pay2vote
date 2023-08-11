import { TeamPoints, accumulateVote, calculateVotePoints } from './PriceService';

// const voteList = [
// 	{ team_id: 6, transaction_id: 8, amount: 20000 },
// 	{ team_id: 6, transaction_id: 52, amount: 10000 },
// 	{ team_id: 6, transaction_id: 178, amount: 30000 },
// 	{ team_id: 7, transaction_id: 40, amount: 20000 },
// 	{ team_id: 7, transaction_id: 45, amount: 10000 },
// 	{ team_id: 7, transaction_id: 60, amount: 100 },
// 	{ team_id: 7, transaction_id: 61, amount: 10000 },
// ];
// const priceListMocked = [
// 	{ price: 10000, point: 10 },
// 	{ price: 20000, point: 40 },
// 	{ price: 50000, point: 100 },
// ];
// const updatedVotes = [
// 	{
// 		team_id: 6,
// 		transaction_id: 8,
// 		amount: 20000,
// 		points: 40,
// 		remaining_amount: 0,
// 	},
// 	{
// 		team_id: 6,
// 		transaction_id: 52,
// 		amount: 10000,
// 		points: 10,
// 		remaining_amount: 0,
// 	},
// 	{
// 		team_id: 6,
// 		transaction_id: 178,
// 		amount: 30000,
// 		points: 50,
// 		remaining_amount: 0,
// 	},
// 	{
// 		team_id: 7,
// 		transaction_id: 40,
// 		amount: 20000,
// 		points: 40,
// 		remaining_amount: 0,
// 	},
// 	{
// 		team_id: 7,
// 		transaction_id: 45,
// 		amount: 10000,
// 		points: 10,
// 		remaining_amount: 0,
// 	},
// 	{
// 		team_id: 7,
// 		transaction_id: 60,
// 		amount: 100,
// 		points: 0,
// 		remaining_amount: 100,
// 	},
// 	{
// 		team_id: 7,
// 		transaction_id: 61,
// 		amount: 10000,
// 		points: 10,
// 		remaining_amount: 0,
// 	},
// ];

export const priceListMocked = [
	{ price: 50000, point: 100 },
	{ price: 20000, point: 40 },
	{ price: 10000, point: 10 },
];

describe('Team point calculation', () => {
	it('calculateVotePoints should return the correct total points and remaining amount', () => {
		const vote = { team_id: 6, transaction_id: 8, amount: 20000 };

		const result = calculateVotePoints(vote.amount, priceListMocked);
		expect(result).toEqual({ points: 40, remaining_amount: 0 });
	});

	it('calculateVotePoints should return the correct total points and remaining amount', () => {
		const vote = { team_id: 6, transaction_id: 8, amount: 30000 };

		const result = calculateVotePoints(vote.amount, priceListMocked);
		expect(result).toEqual({ points: 50, remaining_amount: 0 });
	});

	it('calculateVotePoints should return the correct total points and remaining amount', () => {
		const vote = { team_id: 6, transaction_id: 8, amount: 40000 };

		const result = calculateVotePoints(vote.amount, priceListMocked);
		expect(result).toEqual({ points: 80, remaining_amount: 0 });
	});

	it('calculateVotePoints should return the correct total points and remaining amount', () => {
		const vote = { team_id: 6, transaction_id: 8, amount: 15000 };

		const result = calculateVotePoints(vote.amount, priceListMocked);
		expect(result).toEqual({ points: 10, remaining_amount: 5000 });
	});

	it('calculateVotePoints should return the correct total points and remaining amount', () => {
		const vote = { team_id: 6, transaction_id: 8, amount: 5000 };

		const result = calculateVotePoints(vote.amount, priceListMocked);
		expect(result).toEqual({ points: 0, remaining_amount: 5000 });
	});
	it('calculateVotePoints should return the correct total points and remaining amount', () => {
		const vote = { team_id: 6, transaction_id: 8, amount: 80000 };

		const result = calculateVotePoints(vote.amount, priceListMocked);
		expect(result).toEqual({ points: 150, remaining_amount: 0 });
	});

	it('accumulateVote correctly sums up the points', () => {
		const accumulator = { 6: 50 };
		const vote = {
			team_id: 6,
			transaction_id: 178,
			amount: 30000,
			points: 50,
			remaining_amount: 0,
		};

		const result = accumulateVote(accumulator, vote);

		expect(result).toEqual({ 6: 100 });
	});

	it('calculatePoints correctly calculates the total points per team', async () => {
		const voteList = [
			{ team_id: 6, transaction_id: 8, amount: 20000 },
			{ team_id: 6, transaction_id: 52, amount: 10000 },
			{ team_id: 6, transaction_id: 178, amount: 30000 },
			{ team_id: 7, transaction_id: 40, amount: 20000 },
			{ team_id: 7, transaction_id: 45, amount: 10000 },
			{ team_id: 7, transaction_id: 60, amount: 100 },
			{ team_id: 7, transaction_id: 61, amount: 10000 },
		];

		const updatedVotes = voteList.map((vote) => ({
			...vote,
			...calculateVotePoints(vote.amount, priceListMocked),
		}));

		const voteAccumulator = updatedVotes.reduce(accumulateVote, {});
		const resultArray: TeamPoints[] = Object.entries(voteAccumulator).map(([team_id, points]) => ({
			team_id: parseInt(team_id),
			points: points as number,
		}));

		expect(resultArray).toEqual([
			{ team_id: 6, points: 100 },
			{ team_id: 7, points: 60 },
		]);
	});

	it('calculatePoints correctly calculates the total points per team with empty price list', async () => {
		const voteList = [
			{ team_id: 6, transaction_id: 8, amount: 20000 },
			{ team_id: 6, transaction_id: 52, amount: 10000 },
			{ team_id: 6, transaction_id: 178, amount: 30000 },
			{ team_id: 7, transaction_id: 40, amount: 20000 },
			{ team_id: 7, transaction_id: 45, amount: 10000 },
			{ team_id: 7, transaction_id: 60, amount: 100 },
			{ team_id: 7, transaction_id: 61, amount: 10000 },
		];

		const updatedVotesEmptyPrice = voteList.map((vote) => ({
			...vote,
			...calculateVotePoints(vote.amount, []),
		}));

		const voteAccumulatorEmptyPrice = updatedVotesEmptyPrice.reduce(accumulateVote, {});

		const resultArrayEmptyPrice: TeamPoints[] = Object.entries(voteAccumulatorEmptyPrice).map(
			([team_id, points]) => ({
				team_id: parseInt(team_id),
				points: points as number,
			}),
		);

		expect(resultArrayEmptyPrice).toEqual([
			{ team_id: 6, points: 0 },
			{ team_id: 7, points: 0 },
		]);
	});
});
