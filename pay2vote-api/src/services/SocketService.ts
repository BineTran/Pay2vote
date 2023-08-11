import { Server } from 'socket.io';
import config from 'config';
import { logger } from '@/utils/logger';
import { TeamPoints, calculatePoints } from './PriceService';
import { TransactionRow } from './TransactionService.types';
import { getTeamById } from '@/models/teamsModel';
import { FiService } from '@/models/fiServices.model';

// Active event
export const activeEvents = new Set<string>();

let io: Server;

export const getSocketIOServer = () => {
	if (!io) {
		io = new Server(config.socketioPort, {
			cors: {
				origin: config.clientDomain,
				methods: ['GET', 'POST'],
				credentials: true,
			},
		});
		logger.info('Socket IO instance created');
		// Handles Socket.IO server connections and client event subscriptions.
		io.on('connection', (socket) => {
			logger.info(`User connected: ${socket.id}`);

			// Client requests to join an event.
			socket.on('join', async (eventName: string) => {
				if (typeof eventName !== 'string') {
					return socket.emit('error', 'Invalid event name');
				}

				try {
					socket.join(eventName); // Joins socket to event room.
					activeEvents.add(eventName); // Marks event as active.
					logger.info(`Socket ${socket.id} joined room ${eventName}`);

					socket.emit('message', 'Successfully joined room.');

					logger.info(`Current ${activeEvents.size} active events: ${activeEvents}`);
				} catch (error) {
					logger.error(`Error joining room ${eventName}: ${error}`);
					socket.emit('error', 'Error joining room.');
				}
			});

			socket.on('fetchPoints', async (eventName: string) => {
				if (typeof eventName !== 'string') {
					return socket.emit('error', 'Invalid event name.');
				}

				try {
					const teamsPoints = await calculatePoints(parseInt(eventName, 10));
					io.to(eventName).emit('teams_points', { teamsPoints, timeSend: Date.now() });
				} catch (error) {
					logger.error(`Error fetching points for ${eventName}: ${error}`);
					socket.emit('error', 'Error fetching points.');
				}
			});

			// Client requests to leave an event.
			socket.on('leave', (eventName: string) => {
				socket.leave(eventName); // Leaves event room.

				// If no sockets left in the room, deactivates event.
				io.in(eventName)
					.fetchSockets()
					.then((sockets) => {
						if (sockets.length === 0) {
							logger.info('No socket in room, deleting the room...');
							activeEvents.delete(eventName); // Remove the event from the active events set
						}
					});

				logger.info(`Socket ${socket.id} left room ${eventName}`);
			});

			// Handles client disconnection.
			socket.on('disconnect', () => {
				logger.info(`User disconnected: ${socket.id}`);
			});
		});
	} else {
		logger.info('Already having an socket io instance');
	}

	return io;
};

/**
 * Simply send teams's points to the correct event
 * @param eventId Id of the event that need to send to
 * @param teamsPoints An array of TeamPoints[]
 */
export const sendTeamsPointsToEventRoom = (eventId: number, teamsPoints: TeamPoints[]) => {
	const eventName = eventId.toString();
	const socketServer = getSocketIOServer();
	socketServer.to(eventName).emit('teams_points', { teamsPoints, timeSend: Date.now() });
	logger.info('Message emitted');
};

/**
 * Notify frontend when there is a new transaction row
 * @param eventId Id of an event
 * @param data A transaction row saved in database
 */
export const notifyNewVoteToEventRoom = async (
	eventId: number,
	data: TransactionRow,
	fiServices: FiService[],
	addedPoints: number,
) => {
	const fiService = fiServices.find((fiService) => fiService.fi_bin.toString() === data.counter_account_bank_id);
	const logo = fiService?.logo;
	console.log('This is logo', logo);

	const eventName = eventId.toString();
	const socketServer = getSocketIOServer();
	if (data.team_id && data.team_id !== 0) {
		const teamName = await getTeamById(data.team_id);
		console.log('this is', teamName);
		const isDataValid = data.status === 'valid';
		const message = {
			logo,
			addedPoints,
			bankName: fiService?.fi_name,
			accountNumber: data.counter_account_number,
			accountName: data.counter_account_name,
			donateAmount: data.amount,

			message: isDataValid
				? `donated ${data.amount} for ${teamName?.name}`
				: 'donated incorrect amount or your bank is not supported',
			teamName: `${teamName?.name}`,
			status: `${data.status}`,
		};

		socketServer.to(eventName).emit('new_vote', message);
		logger.info('New vote message emitted');
	}
};
