import { Request, Response } from 'express';

export function getHello(req: Request, res: Response) {
	const userId = req.userId;
	const username = req.username;
	const hello = 'Hello oi!' + userId + username;
	res.send(hello);
}
