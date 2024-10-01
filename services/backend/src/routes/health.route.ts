import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
	res.json({
		status: 'OK',
		message: 'API is healthy',
		timestamp: new Date(),
	});
});

export default router;
