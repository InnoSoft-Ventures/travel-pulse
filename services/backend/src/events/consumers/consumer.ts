import { MessageData, ConsumerStatus } from '@libs/services';


export async function msgConsumer(
	message: MessageData
): Promise<ConsumerStatus | void> {
	console.log('Received message', message);
	switch (message.routingKey) {
		// case AuthEvent.ACCOUNT_CREATED: {
		// 	await createAccount(message.data);
		// 	break;
		// }
	}

	return ConsumerStatus.REQUEUE;
}
