import { Router } from 'express'
import authRoutes from './auth.routes'
import projectRoutes from './project.routes'
import aiRoutes from './ai.routes'
import userRoutes from './user.routes'
import paymentRoutes from './payment.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/projects', projectRoutes)
router.use('/ai', aiRoutes)
router.use('/user', userRoutes)
router.use('/payments', paymentRoutes)

export default router
