import { logger } from '@/utils/logger';
import { queryDB } from '../utils/db';
import { Transaction } from '@/services/TransactionService.types';

export const getTransByTeamID = async (data: any) => {
	const query = `
		SELECT teams.name, transactions.transaction_datetime, transactions.counter_account_name, transactions.amount
		FROM teams
		INNER JOIN transactions
		ON teams.id = transactions.team_id
		WHERE teams.id = ?
		ORDER BY transaction_datetime DESC
	`;
	const result = await queryDB(query, [data]);
	return result;
};

export const getTransByTeamIDValid = async (data: any) => {
	const query = `
		SELECT teams.name, transactions.transaction_datetime, transactions.counter_account_name, transactions.amount
		FROM teams
		INNER JOIN transactions
		ON teams.id = transactions.team_id
		WHERE teams.id = ? AND status = 'valid'
		ORDER BY transaction_datetime DESC
	`;
	const result = await queryDB(query, [data]);
	return result;
};

export const getAllTransPendingByEventID = async (data: any) => {
	const query = `
		SELECT transactions.team_id, transactions.transaction_datetime, transactions.counter_account_bank_id, transactions.counter_account_number, transactions.counter_account_name, transactions.amount,
		transactions.transaction_status, transactions.id, transactions.amount_remaining
		FROM transactions
		LEFT JOIN teams
		ON transactions.team_id = teams.id
		WHERE event_id = ? AND transaction_status = 'pending' AND  amount_remaining >= 10000
		ORDER BY transaction_datetime DESC
	`;
	const result = await queryDB(query, [data]);
	return result;
};

export const getAllRefundingByEventID = async (data: any) => {
	const query = `
		SELECT  transactions.id
		FROM transactions
		LEFT JOIN teams
		ON transactions.team_id = teams.id
		WHERE event_id = ? AND transaction_status = 'refunding'
		ORDER BY transaction_datetime DESC
	`;
	const result = await queryDB(query, [data]);
	return result;
};

export const getAllTransInvalidByEventID = async (data: any) => {
	const query = `
		SELECT transactions.team_id, transactions.transaction_datetime, transactions.counter_account_bank_id, transactions.counter_account_number, transactions.counter_account_name, transactions.amount,
		transactions.transaction_status, transactions.id, transactions.amount_remaining
		FROM transactions
		LEFT JOIN teams
		ON transactions.team_id = teams.id
		WHERE event_id = ? AND (transaction_status = 'pending' OR transaction_status = 'nonrefundable' OR transaction_status = 'refunding' OR transaction_status = 'completed')
		ORDER BY 
			(CASE
				WHEN transaction_status = 'refunding' THEN 1
				WHEN transaction_status = 'pending' THEN 2
				WHEN transaction_status = 'completed' THEN 3
				WHEN transaction_status = 'nonrefundable' THEN 4
				ELSE 5 
			END)
	`;
	const result = await queryDB(query, [data]);
	return result;
};

export const getAllTransInvalid = async () => {
	const query = `
		SELECT * FROM transactions
		WHERE status = 'invalid'
		ORDER BY transaction_datetime DESC
	`;
	const result = await queryDB(query);
	return result;
};

export const getAllTrans = async () => {
	const query = `SELECT 
	transactions.transaction_datetime, 
	transactions.reference, 
	transactions.counter_account_bank_id, 
	transactions.counter_account_number, 
	transactions.counter_account_name, 
	transactions.amount,
	transactions.transaction_status
	FROM 
	transactions
	ORDER BY transaction_datetime DESC
	`;
	const result = await queryDB(query);
	return result;
};

export const getTrans = async (data: any): Promise<Transaction> => {
	const query = 'SELECT * FROM transactions WHERE id = ?';
	const result = await queryDB(query, [data]);
	return result[0];
};

export const getAllTransByEventId = async (eventId: string) => {
	const query = `
		SELECT transactions.team_id, transactions.transaction_datetime, transactions.counter_account_bank_id, transactions.counter_account_number, transactions.counter_account_name, transactions.amount,
		transactions.transaction_status, transactions.status
		FROM transactions
		LEFT JOIN teams
		ON transactions.team_id = teams.id
		WHERE event_id = ? AND status = 'valid'
		ORDER BY transaction_datetime DESC
	`;
	const result = await queryDB(query, [eventId]);
	return result;
};

export const getTransCountByEventId = async (eventId: number) => {
	const sql = `
    SELECT 
      teams.id AS team_id,
      COUNT(transactions.id) as transaction_count
    FROM 
      teams
    LEFT JOIN
      transactions ON teams.id = transactions.team_id
    WHERE 
      teams.event_id = ?
    GROUP BY
      teams.id;`;
	const result = await queryDB(sql, [eventId]);
	return result;
};

type getTransAmountByEventIdTypes = {
	team_id: number;
	transaction_id: number;
	amount: number;
};

export const getTransAmountByEventId = async (eventId: number): Promise<getTransAmountByEventIdTypes[]> => {
	const sql = `
	SELECT
    teams.id as team_id,
    transactions.id as transaction_id,
    IFNULL(transactions.amount , 0) AS amount
  FROM
    teams 
  LEFT JOIN 
    transactions ON teams.id = transactions.team_id
  WHERE 
    teams.event_id =?;
	`;
	const result = await queryDB(sql, [eventId]);
	return result;
};

export const createTrans = async (data: any) => {
	const query =
		'INSERT INTO transactions (team_id, transaction_datetime, reference, payment_chanel, counter_account_bank_id, counter_account_number, counter_account_name, description, status, amount, transaction_status, amount_remaining) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
	await queryDB(query, [
		data.team_id,
		data.transaction_datetime,
		data.reference,
		data.payment_chanel,
		data.counter_account_bank_id,
		data.counter_account_number,
		data.counter_account_name,
		data.description,
		data.status,
		data.amount,
		data.transaction_status,
		data.amount_remaining,
	]);
	logger.info('Transaction created successfully');
};

export const updateTrans = async (data: any) => {
	const query =
		'UPDATE transactions SET  team_id = ?,  transaction_datetime = ?,  reference = ?,  payment_chanel = ?,  counter_account_bank_id = ?,  counter_account_number = ?,  counter_account_name = ?,  description = ?, status = ?, amount = ? WHERE id = ?';
	await queryDB(query, [
		data.team_id,
		data.transaction_datetime,
		data.reference,
		data.payment_chanel,
		data.counter_account_bank_id,
		data.counter_account_number,
		data.counter_account_name,
		data.description,
		data.status,
		data.amount,
		data.id,
	]);
	console.log('Transaction updated successfully');
};

export const updateStatusTransToSuccess = async (data: any) => {
	const query = 'UPDATE transactions SET transaction_status = ?, amount_remaining = ? WHERE id = ?';
	await queryDB(query, ['completed', data.amount, data.id]);
	console.log('Status of Transaction updated successfully');
};

export const updateTransStatusRefunding = async (data: any) => {
	const query = `
		UPDATE transactions
		SET transaction_status = 'refunding'
		WHERE id = ?
	`;
	await queryDB(query, [data]);
	logger.info('Status of Transaction is refunding');
};

export const updateTransStatusPending = async (data: any) => {
	const query = `
		UPDATE transactions
		SET transaction_status = 'pending'
		WHERE id = ?
	`;
	await queryDB(query, [data]);
	logger.info('Status of Transaction is pending');
};

export const deleteTrans = async (data: any) => {
	const query = 'DELETE FROM transactions WHERE id = ?';
	await queryDB(query, [data.id]);
	console.log('event delete event successfully');
};
