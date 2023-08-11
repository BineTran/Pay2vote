import { PrismaClient } from '@prisma/client';
import { getUserByUserId } from '@/models/userAccountModel';

const prisma = new PrismaClient();

async function main() {
	// ... you will write your Prisma Client queries here
	// const allUsers = await prisma.users.findMany({
	//   where: {
	//     id: 1
	//   }
	// })

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const allUsers = await getUserByUserId(1);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
