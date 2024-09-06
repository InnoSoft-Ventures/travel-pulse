import { ACCOUNT_EVENTS, AUTH_EVENTS, bootstrapRabbitMQ } from '@libs/services';

import { msgConsumer } from './consumers/consumer';

export async function rabbitMqInit() {
	const rabbitMQService = await bootstrapRabbitMQ('DEMO_SERVICE');

	rabbitMQService.connection.on('connection', () => {
		// Create publisher
		// rabbitMQService.createPublisher({
		// 	exchanges: [{ exchange: ACCOUNT_EVENTS.name, type: 'fanout' }],
		// });
	});

	// Subscribe to different queues from this service

	// Subscribe to auth events
	// rabbitMQService.subscribe(
	// 	AUTH_EVENTS.name,
	// 	{
	// 		exchanges: [{ exchange: AUTH_EVENTS.exchange, type: 'fanout' }],
	// 		queueBindings: [
	// 			{
	// 				exchange: AUTH_EVENTS.exchange,
	// 				routingKey: AUTH_EVENTS.routingKey,
	// 			},
	// 		],
	// 	},
	// 	async (msg) => msgConsumer(msg)
	// );
}
