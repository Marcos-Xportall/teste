import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../config/database'
import { AppError, asyncHandler } from '../middleware/errorHandler'
import { generateProjectCode } from '../services/ai.service'
import { deployToVercel } from '../services/deploy.service'
import { deductCredits } from '../services/credits.service'
import { io } from '../index'

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  prompt: z.string().min(10),
})

const generateCodeSchema = z.object({
  prompt: z.string().min(1),
})

export const getAllProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await prisma.project.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  })

  res.json(projects)
})

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
    include: {
      deployments: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  })

  if (!project) {
    throw new AppError('Project not found', 404)
  }

  res.json(project)
})

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, prompt } = createProjectSchema.parse(req.body)

  // Create project
  const project = await prisma.project.create({
    data: {
      name,
      description,
      prompt,
      userId: req.user.id,
      status: 'GENERATING',
    },
  })

  // Generate code asynchronously
  generateProjectCode(project.id, prompt, req.user.id).catch(console.error)

  res.status(201).json(project)
})

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, description, code } = req.body

  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  })

  if (!project) {
    throw new AppError('Project not found', 404)
  }

  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(description && { description }),
      ...(code && { code }),
    },
  })

  res.json(updatedProject)
})

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  })

  if (!project) {
    throw new AppError('Project not found', 404)
  }

  await prisma.project.delete({
    where: { id },
  })

  res.json({ message: 'Project deleted successfully' })
})

export const generateCode = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const { prompt } = generateCodeSchema.parse(req.body)

  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  })

  if (!project) {
    throw new AppError('Project not found', 404)
  }

  // Deduct credits
  await deductCredits(req.user.id, parseInt(process.env.CREDIT_COST_AI_CALL || '2'))

  // Update status
  await prisma.project.update({
    where: { id },
    data: { status: 'GENERATING' },
  })

  // Generate code asynchronously
  generateProjectCode(id, prompt, req.user.id, project.code as any).catch(console.error)

  res.json({ message: 'Code generation started' })
})

export const deployProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  })

  if (!project) {
    throw new AppError('Project not found', 404)
  }

  if (!project.code) {
    throw new AppError('Project has no code to deploy', 400)
  }

  // Deduct credits
  await deductCredits(req.user.id, parseInt(process.env.CREDIT_COST_DEPLOY || '10'))

  // Create deployment record
  const deployment = await prisma.deployment.create({
    data: {
      projectId: id,
      status: 'DEPLOYING',
    },
  })

  // Deploy asynchronously
  deployToVercel(project, deployment.id).catch(console.error)

  res.json({ message: 'Deployment started', deployment })
})
