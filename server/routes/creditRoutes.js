import express from 'express';
import { getPlans, purchasePlans, verifyPayment } from '../controllers/creditController.js';
import { protect } from '../middlewares/auth.js';

const creditRouter = express.Router()

creditRouter.get('/plan', getPlans)
creditRouter.post('/purchase', protect, purchasePlans)
creditRouter.post('/verify', protect, verifyPayment)

export default creditRouter