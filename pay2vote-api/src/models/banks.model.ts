import prisma from '@/libs/prisma';
import { logger } from '@/utils/logger';

export interface Bank {
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

export const findBanks = async () => {
	const banks = await prisma.banks.findMany();
	return banks;
};

export const upsertBanks = async (banks: Bank[]) => {
	const upsertPromises = banks.map((bank) => {
		return prisma.banks.upsert({
			where: { id: bank.id },
			create: bank,
			update: bank,
		});
	});
	try {
		await Promise.all(upsertPromises);
		logger.info('Banks updated successfully');
	} catch (error: any) {
		logger.error(error, 'An error occur while updating banks');
	}
};
