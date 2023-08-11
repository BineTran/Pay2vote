export type transactionBH = {
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
};

export interface transactionDB {
	transaction_datetime: string;
	reference: string;
	counter_account_bank_id: string;
	counter_account_number: string;
	counter_account_name: string;
	amount: number;
	transaction_status: string;
}
