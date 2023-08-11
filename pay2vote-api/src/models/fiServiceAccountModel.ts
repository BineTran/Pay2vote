import { queryDB } from '../utils/db';
import { logger } from '@/utils/logger';
import { FIAccountType } from '@/controllers/bankHubController';

export interface FiServiceAccount {
	uuid: string;
	code: string;
	name: string;
	type: string;
	logo: string;
	user_id: number;
	access_token: string;
	account_number: string;
	account_name: string;
	bin: string;
	account_type: 'normal' | 'refund';
	created_at?: Date;
	updated_at?: Date;
}

export const createAccount = async (account: Omit<FiServiceAccount, 'created_at' | 'updated_at'>): Promise<void> => {
	const sql = `
    INSERT INTO fi_service_account(uuid, code, name, type, logo, user_id, access_token, account_number, account_name, bin)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
	const params = [
		account.uuid,
		account.code,
		account.name,
		account.type,
		account.logo,
		account.user_id,
		account.access_token,
		account.account_number,
		account.account_name,
		account.bin,
	];
	await queryDB(sql, params);
};

/**
 *
 * @param user_id Id of user
 * @param account_type Account type of user, default will be 'normal', other is 'refund'
 * @returns Fi Service account information
 */
export const getAccountByUserId = async (
	user_id: number,
	account_type: FIAccountType = 'normal',
): Promise<FiServiceAccount | FiServiceAccount[]> => {
	const sql = `
		SELECT 	
			id, uuid,  code, name, type, logo, user_id, access_token, account_number, account_name, bin, created_at, updated_at 
		FROM 
			fi_service_account WHERE user_id = ? and account_type = ?
		`;
	const results = await queryDB(sql, [user_id, account_type]);
	if (results.length === 0) {
		return [];
	} else {
		return results[0];
	}
};

export const updateAccount = async (account: Partial<FiServiceAccount> & { user_id: number }): Promise<void> => {
	console.log('Account received in model:', account);

	const updateableFields: (keyof FiServiceAccount)[] = [
		'uuid',
		'code',
		'name',
		'type',
		'logo',
		'access_token',
		'account_number',
		'account_name',
		'bin',
	];
	const updates = [];
	const params = [];

	for (const field of updateableFields) {
		if (field in account) {
			updates.push(`${field} = ?`);
			params.push(account[field as keyof FiServiceAccount]);
		}
	}

	if (!updates.length) {
		throw new Error('No field provided to update');
	}

	params.push(account.user_id);
	const sql = `UPDATE fi_service_account SET ${updates.join(', ')} WHERE user_id = ?`;
	await queryDB(sql, params);
};

export const deleteAccountByUUID = async (uuid: string): Promise<void> => {
	const sql = 'DELETE FROM fi_service_account WHERE uuid = ?';
	await queryDB(sql, [uuid]);
};

export const deleteAccountByUserId = async (user_id: number): Promise<void> => {
	const sql = 'DELETE FROM fi_service_account WHERE user_id = ?';
	await queryDB(sql, [user_id]);
};

export const upsertAccount = async (data: FiServiceAccount): Promise<void> => {
	const sql = `
  INSERT INTO fi_service_account 
    (uuid, code, name, type, logo, user_id, access_token, account_number, account_name, bin, account_type) 
  VALUES 
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE 
    uuid = VALUES(uuid),
    code = VALUES(code),
    name = VALUES(name),
    type = VALUES(type),
    logo = VALUES(logo),
    access_token = VALUES(access_token),
    account_number = VALUES(account_number),
    account_name = VALUES(account_name),
    bin = VALUES(bin),
	account_type = VALUES(account_type)`;
	const params = [
		data.uuid,
		data.code,
		data.name,
		data.type,
		data.logo,
		data.user_id,
		data.access_token,
		data.account_number,
		data.account_name,
		data.bin,
		data.account_type,
	];
	await queryDB(sql, params);
};

export const getAccessTokenByUserId = async (userId: number): Promise<{ access_token: string }> => {
	try {
		const sql = `
            SELECT access_token
            FROM fi_service_account
            WHERE user_id = ? AND account_type = 'normal'
            LIMIT 1
        `;
		const results = await queryDB(sql, [userId]);
		if (results.length === 0) {
			throw new Error('No record found');
		} else {
			return results[0];
		}
	} catch (error: any) {
		logger.error(error, 'Error in getting access token by user id');
		throw error;
	}
};

export const getRefundAccessTokenByUserId = async (userId: number): Promise<{ access_token: string }> => {
	try {
		const sql = `
            SELECT access_token
            FROM fi_service_account
            WHERE user_id = ? AND account_type = 'refund'
            LIMIT 1
        `;
		const results = await queryDB(sql, [userId]);
		if (results.length === 0) {
			throw new Error('No record found');
		} else {
			return results[0];
		}
	} catch (error: any) {
		logger.error(error, 'Error in getting access token by user id');
		throw error;
	}
};
