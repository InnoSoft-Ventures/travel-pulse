import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import helmet from 'helmet';
import routes from './routes';
import cors from 'cors';
import * as dotenv from 'dotenv';
import {
	NotFoundException,
	errorMiddleware,
	logger,
} from '@travelpulse/middlewares';

dotenv.config();

const app = express();

app.use(
	helmet({
		contentSecurityPolicy: {
			useDefaults: true,
			directives: {
				// Allow frontend (3000) to open EventSource to backend (4000)
				// @ts-ignore
				'connect-src': ["'self'", 'http://localhost:4000'],
			},
		},
	})
);
// Disable compression for Server-Sent Events to avoid buffering
app.use(
	compression({
		filter: (req, res) => {
			const accept = req.headers['accept'] || '';
			if (
				typeof accept === 'string' &&
				accept.includes('text/event-stream')
			) {
				return false;
			}
			// Also skip for SSE route path
			if (req.url?.startsWith('/sse/')) return false;
			// Fallback to default filter
			// @ts-ignore
			return compression.filter(req, res);
		},
	})
);
app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:3000', // FE URL
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Register logger
app.use(logger('combined'));

// Initialize RabbitMQ connection
// rabbitMqInit();

// Config routers
app.use(routes);

app.use((_req, _res) => {
	throw new NotFoundException('Not found', null);
});

// Register the error handler middleware
app.use(errorMiddleware);

export default app;
