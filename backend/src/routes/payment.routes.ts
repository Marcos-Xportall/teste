import { Router } from 'express'
import * as paymentController from '../controllers/payment.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/plans', paymentController.getPlans)
router.post('/create-checkout-session', authenticate, paymentController.createCheckoutSession)
router.get('/transactions', authenticate, paymentController.getTransactions)
router.post('/webhook', paymentController.stripeWebhook)

export default router
