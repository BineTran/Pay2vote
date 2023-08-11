export {};
// This place declare type that i need to pass data from middleware down
// If this not exist, req.userId wont be possible and it will throw type error
declare global {
	namespace Express {
		interface Request {
			userId?: number;
			username?: string;
		}
	}
}
