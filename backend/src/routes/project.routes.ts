import { Router } from 'express'
import * as projectController from '../controllers/project.controller'
import { authenticate, checkCredits } from '../middleware/auth'

const router = Router()

// All project routes require authentication
router.use(authenticate)

router.get('/', projectController.getAllProjects)
router.get('/:id', projectController.getProject)
router.post('/', checkCredits(50), projectController.createProject)
router.put('/:id', projectController.updateProject)
router.delete('/:id', projectController.deleteProject)
router.post('/:id/generate', checkCredits(10), projectController.generateCode)
router.post('/:id/deploy', checkCredits(10), projectController.deployProject)

export default router
