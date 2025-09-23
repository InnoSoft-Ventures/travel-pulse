import { Request, Response, Router } from 'express';
import { registerPaymentSSE } from '../services/sse/payment-sse.service';

const router = Router();

router.get('/payments', (req: Request, res: Response) => {
	// current user id from session middleware
	const userId = req.user?.accountId;
	if (!userId) {
		res.status(401).end();
		return;
	}
	registerPaymentSSE(userId, res);
	return;
});

export default router;
