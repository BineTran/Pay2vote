export interface Transaction {
	reference: string;
	bookingDate: string;
	transactionDate: string;
	transactionDateTime: string;
	amount: number;
	description: string;
	runningBalance: number;
	accountNumber: string;
	virtualAccountNumber: string;
	virtualAccountName: string;
	paymentChannel: string;
	counterAccountNumber: string;
	counterAccountName: string;
	counterAccountBankId: string;
	counterAccountBankName: string;
}

export type TransactionRow = {
	team_id: number | null;
	transaction_datetime: string;
	reference: string;
	payment_chanel: string;
	counter_account_bank_id: string;
	counter_account_number: string;
	counter_account_name: string;
	description: string;
	status: string;
	amount: number;
	transaction_status?: string;
	amount_remaining: number;
};
