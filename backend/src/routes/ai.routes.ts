import { Router } from 'express'
import * as aiController from '../controllers/ai.controller'
import { authenticate, checkCredits } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.post('/generate-idea', checkCredits(2), aiController.generateIdea)
router.post('/generate-code', checkCredits(5), aiController.generateCode)
router.post('/edit-component', checkCredits(5), aiController.editComponent)
router.post('/analyze-image', checkCredits(3), aiController.analyzeImage)

export default router
