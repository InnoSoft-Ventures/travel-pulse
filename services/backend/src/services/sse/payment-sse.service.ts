import { Response } from 'express';

type Client = { res: Response };

const clientsByUser = new Map<number, Set<Client>>();

export function registerPaymentSSE(userId: number, res: Response) {
	const headers = {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive',
	} as const;
	res.writeHead(200, headers);
	// Recommended retry interval in ms
	res.write(`retry: 5000\n\n`);

	const client: Client = { res };
	if (!clientsByUser.has(userId)) clientsByUser.set(userId, new Set());
	clientsByUser.get(userId)!.add(client);

	// Initial ping
	res.write(
		`event: ping\n` + `data: ${JSON.stringify({ t: Date.now() })}\n\n`
	);

	console.log(`Registered payment SSE for user ${userId}`);

	// Heartbeat
	const hb = setInterval(() => {
		try {
			res.write(
				`event: ping\n` +
					`data: ${JSON.stringify({ t: Date.now() })}\n\n`
			);
		} catch {}
	}, 25000);

	res.on('close', () => {
		clearInterval(hb);
		clientsByUser.get(userId)?.delete(client);
		if (clientsByUser.get(userId)?.size === 0) clientsByUser.delete(userId);
	});
}

export function sendPaymentConfirmed(
	userId: number,
	payload: { orderId: number; paymentId: number; referenceId?: string }
) {
	const clients = clientsByUser.get(userId);

	console.log(
		`Sending payment-confirmed SSE to user ${userId}, ${clients?.size} clients`
	);

	if (!clients) return;
	const data = JSON.stringify(payload);
	for (const client of clients) {
		try {
			client.res.write(
				`event: payment-confirmed\n` + `data: ${data}\n\n`
			);
		} catch {}
	}
}
