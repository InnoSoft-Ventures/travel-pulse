export const SERVICE_NAME = {
	AUTH_SERVICE: "auth-service/auth",
	NOTIFICATION_SERVICE: "notification-service/notifications",
	ANALYTICS_SERVICE: "http://localhost:4008",
	LOGGING_SERVICE: "http://localhost:4010",
};

export type SERVICE = keyof typeof SERVICE_NAME;
