import { ConsumerStatus as RabbitmqConsumerStatus } from "rabbitmq-client";

export interface MessageData {
	data: any;
	exchange: string;
	routingKey: string;
}

export { RabbitmqConsumerStatus as ConsumerStatus };
