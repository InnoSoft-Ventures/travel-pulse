import {
	AsyncMessage,
	Connection,
	Consumer,
	ConsumerProps,
	ConsumerStatus,
	Envelope,
	Publisher,
	PublisherProps,
} from "rabbitmq-client";
import { eventBus } from "./eventBus";
import { MessageData } from "./interface";

type QueueBindingsExtended = ConsumerProps["queueBindings"];

type QueueInfo = ConsumerProps["queueOptions"] & {
	queue: string;
};

type ConsumerPropsExtended = Omit<ConsumerProps, "queue" | "qos">;

class RabbitMQService {
	private static instance: RabbitMQService;
	public connection!: Connection;
	private publisher!: Publisher;
	private consumer!: Consumer;

	private constructor(private serviceName: string) {}

	public static getInstance(serviceName: string): RabbitMQService {
		if (!this.instance) {
			this.instance = new RabbitMQService(serviceName);
		}
		return this.instance;
	}

	public async connect(): Promise<void> {
		if (!this.connection) {
			this.connection = new Connection({
				connectionName: this.serviceName,
				username: process.env.RABBITMQ_USER,
				password: process.env.RABBITMQ_PASSWORD,
				hostname: process.env.RABBITMQ_HOST,
				port: parseInt(process.env.RABBITMQ_PORT || "5672"),
				acquireTimeout: 50000,
				connectionTimeout: 50000,
			});

			this.connection.on("error", (err: any) => {
				console.error("RabbitMQ connection error", err);
			});

			this.connection.on("connection", () => {
				console.log("RabbitMQ connection successfully (re)established");
			});
		}
	}

	public async createPublisher(publisherProps: PublisherProps): Promise<void> {
		if (!this.publisher) {
			try {
				this.publisher = this.connection.createPublisher({
					...publisherProps,
					confirm: publisherProps.confirm ?? true,
					maxAttempts: publisherProps.maxAttempts ?? 2,
				});

				eventBus.on("rabbitmq.publish").subscribe((eventData) => {
					this.publish(eventData.queue, eventData.data).catch(console.error);
				});

				console.log("Publisher created successfully");
			} catch (err) {
				console.error("Error creating publisher", err);
			}
		}
	}

	public async publish(queue: string | Envelope, message: any): Promise<void> {
		if (!this.publisher) {
			throw new Error("Publisher not initialized");
		}
		try {
			console.log("Publishing event", { queue, message });
			await this.publisher.send(queue, message);
		} catch (err) {
			console.error("Error publishing message", err);
			throw err; // Propagate the error to handle retries, etc.
		}
	}

	private async declareExchange(
		exchanges: ConsumerProps["exchanges"]
	): Promise<void> {
		if (!exchanges) return;

		for (const exchange of exchanges) {
			await this.connection.exchangeDeclare({
				exchange: exchange.exchange,
				type: exchange.type,
				durable: exchange.durable,
			});
		}
	}

	private async bindQueues(
		queueInfo: QueueInfo,
		queueBindings: QueueBindingsExtended
	): Promise<void> {
		if (!queueBindings) return;

		for (const binding of queueBindings) {
			await this.connection.queueBind({
				queue: queueInfo.queue,
				exchange: binding.exchange,
				routingKey: binding.routingKey,
			});
		}
	}

	private async declareQueues(queueInfo: QueueInfo) {
		await this.connection.queueDeclare({
			queue: queueInfo.queue,
			durable: queueInfo.durable,
		});
	}

	public async subscribe(
		queueInfo: QueueInfo,
		consumerProps: ConsumerPropsExtended,
		callback: (message: MessageData) => Promise<ConsumerStatus | void>
	): Promise<void> {
		if (!this.connection) {
			await this.connect();
		}

		await this.declareExchange(consumerProps.exchanges);

		await this.declareQueues(queueInfo);

		await this.bindQueues(queueInfo, consumerProps.queueBindings);

		this.consumer = this.connection.createConsumer(
			{
				consumerTag: this.serviceName,
				queue: queueInfo.queue,
				queueOptions: queueInfo,
				...consumerProps,
			},
			async (msg: AsyncMessage) => {
				return await callback({
					data: msg.body,
					exchange: msg.exchange,
					routingKey: msg.routingKey,
				});
			}
		);

		this.consumer.on("error", (err: any) => {
			console.error(`Consumer error on queue(s)`, err);
		});
	}

	public async close(): Promise<void> {
		try {
			if (this.publisher) {
				await this.publisher.close();
			}
			if (this.consumer) {
				await this.consumer.close();
			}
			await this.connection.close();
		} catch (err) {
			console.error("Error closing RabbitMQ resources", err);
		}
	}
}

export { RabbitMQService };
