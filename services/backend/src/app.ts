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

app.use(helmet());
app.use(compression());
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

// Authentication and Authorization middleware
// app.use(routeMiddleware);

// Config routers
app.use(routes);

app.use((_req, _res) => {
	throw new NotFoundException('Not found', null);
});

// Register the error handler middleware
app.use(errorMiddleware);

export default app;
