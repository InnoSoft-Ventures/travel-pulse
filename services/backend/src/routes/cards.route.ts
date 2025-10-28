import { errorHandler } from '@travelpulse/middlewares';

import { Router } from 'express';
import {
	deleteCard,
	getCards,
	markDefaultCard,
} from '../controllers/cards.controller';

const router = Router();

router.get('/', errorHandler(getCards));
router.delete('/:cardId', errorHandler(deleteCard));
router.post('/:cardId/default', errorHandler(markDefaultCard));

export default router;
