import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.MCP_PORT || 3001;

// PostgreSQL connection pool
const pool = new Pool({
	user: process.env.POSTGRES_USER || 'devuser',
	host: process.env.POSTGRES_HOST || 'localhost',
	database: process.env.POSTGRES_DB || 'travelpulse_db',
	password: process.env.POSTGRES_PASSWORD || 'devpass',
	port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_, res) => {
	res.json({ status: 'ok' });
});

// Generic query endpoint
app.post('/query', async (req, res) => {
	try {
		const { query, params = [] } = req.body;

		// Basic security check - only allow SELECT queries
		if (!query.trim().toLowerCase().startsWith('select')) {
			return res
				.status(400)
				.json({ error: 'Only SELECT queries are allowed' });
		}

		const result = await pool.query(query, params);
		return res.json(result.rows);
	} catch (error) {
		console.error('Error executing query:', error);
		let errorMessage = 'Unknown error';
		if (error instanceof Error) {
			errorMessage = error.message;
		}
		return res.status(500).json({
			error: 'Query execution failed',
			details: errorMessage,
		});
	}
});

app.listen(port, () => {
	console.log(`MCP server running on port ${port}`);
});
