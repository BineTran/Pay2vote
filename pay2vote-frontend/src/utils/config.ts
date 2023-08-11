export const config = {
	clientDomain: `${process.env.NEXT_PUBLIC_APP_ORIGIN}`,
	serverDomain: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}`,
	socketServerPath: "/socket.io",
	development: false,
	apiRoute: {
		BANKHUB_URL_API: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/bankhub/url`,
		BANKHUB_ACCESS_TOKEN_API: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/bankhub/access-token`,
		USER_INFO_API: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/user/info`,
		LOGIN_API: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/auth/login`,
		LOGOUT_API: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/auth/logout`,
		CREATE_TEAM_API: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/team/create`,
		GET_ALL_EVENTS_API: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/event/getall`,
		GET_ALL_TEAMS_IN_EVENT: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/team/getall`,
		UPLOAD_IMAGE: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/v1/upload/image`,
		CREATE_EVENT: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/api/v1/event/create`,
		POST_TRANSFER: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/bankhub/transfer`,
		GET_ALL_QR_OF_EVENT: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/qr/getAllEvent`,
		GET_EVENTS_OF_USER: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/event/getallforad`,
		REFRESH_AN_EVENT: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/schedule/refresh`,
		USER_REFUND_INFO_API: `${process.env.NEXT_PUBLIC_SERVER_DOMAIN as string}/api/v1/user/refund-info`,
		GET_INVALID_TRANSACTIONS_BY_EVENT_ID: `${
			process.env.NEXT_PUBLIC_SERVER_DOMAIN as string
		}/api/v1/transaction/getAllInvalidByEventID`,
		GET_VALID_TRANSACTIONS_BY_EVENT_ID: `${
			process.env.NEXT_PUBLIC_SERVER_DOMAIN as string
		}/api/v1/transaction/eventID`,
	},
};
