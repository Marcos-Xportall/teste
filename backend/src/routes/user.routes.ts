import { Router } from 'express'
import * as userController from '../controllers/user.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/profile', userController.getProfile)
router.put('/profile', userController.updateProfile)
router.get('/credits', userController.getCredits)
router.get('/usage', userController.getUsage)

export default router
