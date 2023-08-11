import { REFUND_STATUS, VOTE_STATUS, processRefundStatus } from './TransactionService';
import { calculateVotePoints } from './PriceService';
import { fakeDataBine } from './TransactionService.test';

const priceListMocked = [
	{ price: 50000, point: 50 },
	{ price: 20000, point: 20 },
];

const lowestPrice = priceListMocked.reduce((min, price) => Math.min(min, price.price), Infinity);

describe('processRefundStatus', () => {
	it('should return lowest price correctly', () => {
		expect(lowestPrice).toEqual(20000);
	});

	it('should return correct refund and transaction status for valid transaction with remaining amount = 0', () => {
		const transaction = { ...fakeDataBine[0], amount: 20000 };
		const remaining_amount = 0;

		const expectedStatus = VOTE_STATUS.VALID;
		const expectedTransactionStatus = REFUND_STATUS.VALID;

		const { status, transaction_status } = processRefundStatus(transaction, remaining_amount, lowestPrice);

		expect(status).toBe(expectedStatus);
		expect(transaction_status).toBe(expectedTransactionStatus);
	});

	it('should return correct refund and transaction status for invalid transaction (lower than smallest price)', () => {
		const transaction = { ...fakeDataBine[0], amount: 10000 };
		const remainingAmount = 10000;
		const { remaining_amount } = calculateVotePoints(transaction.amount, priceListMocked);

		expect(remainingAmount).toEqual(remaining_amount);

		const expectedStatus = VOTE_STATUS.INVALID;
		const expectedTransactionStatus = REFUND_STATUS.PENDING;

		const { status, transaction_status } = processRefundStatus(transaction, remaining_amount, lowestPrice);

		expect(status).toBe(expectedStatus);
		expect(transaction_status).toBe(expectedTransactionStatus);
	});

	it('should return correct refund and transaction status for valid transaction with remaining amount greater than minimum refund amount', () => {
		const transaction = { ...fakeDataBine[0], amount: 45000 };
		const remainingAmount = 15000; // For example, a remaining amount greater than minimum refund
		const expectedStatus = VOTE_STATUS.VALID;
		const expectedTransactionStatus = REFUND_STATUS.PENDING; // Should return pending since it greater than minimum amount

		const { status, transaction_status } = processRefundStatus(transaction, remainingAmount, lowestPrice);

		expect(status).toBe(expectedStatus);
		expect(transaction_status).toBe(expectedTransactionStatus);
	});

	it('should return correct refund and transaction status for valid transaction with no remaining amount', () => {
		const transaction = { ...fakeDataBine[0], amount: 20000 };
		const remainingAmount = 0; // No remaining amount
		const expectedStatus = VOTE_STATUS.VALID;
		const expectedTransactionStatus = REFUND_STATUS.VALID;

		const { status, transaction_status } = processRefundStatus(transaction, remainingAmount, lowestPrice);

		expect(status).toBe(expectedStatus);
		expect(transaction_status).toBe(expectedTransactionStatus);
	});

	it('should return correct refund and transaction status for valid transaction with remaining amount less than minimum refund amount', () => {
		const transaction = { ...fakeDataBine[0], amount: 25000 };
		const remainingAmount = 5000;
		const expectedStatus = VOTE_STATUS.VALID;
		const expectedTransactionStatus = REFUND_STATUS.NON_REFUNDABLE;

		const { status, transaction_status } = processRefundStatus(transaction, remainingAmount, lowestPrice);

		expect(status).toBe(expectedStatus);
		expect(transaction_status).toBe(expectedTransactionStatus);
	});

	it('should return correct refund and transaction status for non-refundable transaction even if the amount is correct', () => {
		const transaction = { ...fakeDataBine[0], amount: 20000 };
		transaction.counterAccountNumber = ''; // Make the transaction non-refundable
		const remainingAmount = 20000;
		const expectedStatus = VOTE_STATUS.VALID;
		const expectedTransactionStatus = REFUND_STATUS.NON_REFUNDABLE;

		const { status, transaction_status } = processRefundStatus(transaction, remainingAmount, lowestPrice);

		expect(status).toBe(expectedStatus);
		expect(transaction_status).toBe(expectedTransactionStatus);
	});

	it('donated 15000, smallest amount is 20000, refund amount is 10000', () => {
		const transaction = { ...fakeDataBine[0], amount: 15000 };
		const remainingAmount = 15000;
		const expectedStatus = VOTE_STATUS.INVALID;
		const expectedTransactionStatus = REFUND_STATUS.PENDING;

		const { status, transaction_status } = processRefundStatus(transaction, remainingAmount, lowestPrice);

		expect(status).toBe(expectedStatus);
		expect(transaction_status).toBe(expectedTransactionStatus);
	});
});
