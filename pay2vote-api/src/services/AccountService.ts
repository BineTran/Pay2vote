import { FiServiceAccount } from '../models/fiServiceAccountModel';
import makeRequest from '../utils/api';
import config from '../../config';
import { upsertAccount } from '../models/fiServiceAccountModel';
import { logger } from '@/utils/logger';
import { findBanks } from '@/models/banks.model';
import { FIAccountType } from '@/controllers/bankHubController';

// export interface FiServiceAccount {
//     uuid: string;
//     code: string;
//     name: string;
//     type: string;
//     logo: string;
//     user_id: number;
//     access_token: string;
//     account_number: string;
//     account_name: string;
//     bin: string;
//     created_at?: Date;
//     updated_at?: Date;
//   }

interface Auth {
	requestId: string;
	accounts: Account[];
	owner: Owner;
	company?: any;
	fiService: FiService;
}

interface FiService {
	uuid: string;
	code: string;
	name: string;
	type: string;
	logo: string;
}

interface Owner {
	name: string;
	phone: string;
	email: string;
	sex: string;
	birthday: string;
	legalId: string;
}

interface Account {
	accountName: string;
	balance: number;
	currency: string;
	accountNumber: string;
}

interface Bank {
	id: number;
	name: string;
	code: string;
	bin: string;
	shortName: string;
	logo: string;
	transferSupported: number;
	lookupSupported: number;
	short_name: string;
	support: number;
	isTransfer: number;
	swift_code: string | null;
}

const fetchAuthData = async (accessToken: string) => {
	// Perform fetching auth
	const method = 'POST';
	const url = `${config.serverDomain}/api/v1/bankhub/auth`;
	const data = {
		accessToken: accessToken,
	};
	try {
		const response = await makeRequest(method, url, {}, data);

		return response;
	} catch (error: any) {
		logger.error('Failed to get auth data from BankHub');
	}
};

/**
 * This function finds and returns the 'bin' value of a bank from a list of banks based on a given shortName.
 * If the bank is not found, it returns null.
 *
 * @param {string} name - The short name of the bank to be searched.
 * @param {Bank[]} bankList - The list of banks to search from.
 * @return {(string|null)} The 'bin' value of the found bank or null if not found.
 */
export const findBINByShortName = (name: string, code: string, bankList: Bank[]): string | null => {
	const object = bankList.find((item) => {
		const isNameIncludeShortName = name.toLowerCase().includes(item.shortName.toLowerCase());
		const isCodeIncludeShortName = code.toLowerCase().includes(item.shortName.toLowerCase());
		const isNameIncludeCode = name.toLowerCase().includes(item.code.toLowerCase());
		return isNameIncludeShortName || isCodeIncludeShortName || isNameIncludeCode;
	});

	return object ? object.bin : null;
};

/**
 * This function fetches authentication data and account data from an external service.
 * Then it retrieves the bank identification number (bin) by comparing the bank's short name with a list of banks.
 * Finally, it saves or updates the data into the 'fi_service_account' table.
 *
 * @param {string} accessToken - The access token for fetching data from the external service.
 * @param {number} userId - The user ID for which the data needs to be saved.
 * @throws Will throw an error if the 'bin' cannot be found in the list of banks.
 * @return {Promise<void>}
 */
export const saveInfoToFiServiceAccount = async (
	accessToken: string,
	userId: number,
	accountType: FIAccountType,
): Promise<void> => {
	logger.info('Starting saving user bank account');

	// Get auth data
	const authData: Auth = await fetchAuthData(accessToken);
	logger.info('Success getting auth data in saving fi service account');
	const accountData: Account = authData.accounts[0];
	const fiServiceData: FiService = authData.fiService;
	const bankList: Bank[] = await findBanks();
	logger.info('Got bank list and user auth data from BankHub');

	const bin = findBINByShortName(fiServiceData.name, fiServiceData.code, bankList);

	if (!bin) {
		logger.error('Did not found BIN code');
		throw new Error('Did not found any bin from bank lists, maybe from wrong code or operation malfunction');
	} else {
		logger.info('Found BIN code');
	}

	const account: FiServiceAccount = {
		...fiServiceData,
		user_id: userId,
		access_token: accessToken,
		account_name: accountData.accountName,
		account_number: accountData.accountNumber,
		bin: bin,
		account_type: accountType,
	};
	logger.info(`Account object created with userId: ${userId}`);

	try {
		await upsertAccount(account);
	} catch (error) {
		logger.error(account, 'Error in updating user fi account');
	}
};
