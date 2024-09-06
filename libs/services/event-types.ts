export const EVENT_BUS = {
	/**
	 * Event for publishing to RabbitMQ
	 */
	RABBIT_MQ: "rabbitmq.publish",
};

export const AUTH_EVENTS = {
	exchangeTopic: "auth.topic",
	queue: "auth-service",
	routingKey: "auth.#",
};

export const LEAVE_EVENTS = {
	exchangeTopic: "leave.topic",
	queue: "leave-service",
	routingKey: "leave.#",
};

export const ACCOUNT_EVENTS = {
	exchangeTopic: "account.topic",
	queue: "account-service",
	routingKey: "account.#",
};

export const NOTIFICATION_EVENTS = {
	exchangeTopic: "notification.topic",
	queue: "notification-service",
	routingKey: "notification.#",
};

// Auth Events
export const AuthEvent = {
	ACCOUNT_CREATED: "auth.account-created",
	EMPLOYEE_ID_UPDATED: "auth.employee-id-updated",
	EMPLOYEE_CREATED: "auth.employee-created",
	INVITE_ACCEPTED: "auth.invite-accepted",
	FORGOT_PASSWORD: "auth.forgot-password",
};

// Account Events
export const AccountEvent = {
	EMPLOYEE_CREATED: "account.employee-created",
	ORGANIZATION_CREATED: "account.organization-created",
};

// Notification Events
export const NotificationEvent = {};

// Leave Events
export const LeaveEvent = {
	LEAVE_REQUEST_CREATED: "leave.request.created",
	LEAVE_REQUEST_UPDATED: "leave.request.updated",
	LEAVE_REQUEST_DELETED: "leave.request.deleted",
};
