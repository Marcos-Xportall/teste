import { Request, Response } from 'express'
import { z } from 'zod'
import { asyncHandler } from '../middleware/errorHandler'
import * as aiService from '../services/ai.service'
import { deductCredits } from '../services/credits.service'

const generateIdeaSchema = z.object({
  prompt: z.string().min(1),
})

const generateCodeSchema = z.object({
  prompt: z.string().min(1),
  context: z.any().optional(),
})

const editComponentSchema = z.object({
  componentCode: z.string().min(1),
  instruction: z.string().min(1),
})

const analyzeImageSchema = z.object({
  imageUrl: z.string().url(),
})

export const generateIdea = asyncHandler(async (req: Request, res: Response) => {
  const { prompt } = generateIdeaSchema.parse(req.body)

  await deductCredits(req.user.id, parseInt(process.env.CREDIT_COST_AI_CALL || '2'))

  const idea = await aiService.generateAppIdea(prompt)

  res.json({ idea })
})

export const generateCode = asyncHandler(async (req: Request, res: Response) => {
  const { prompt, context } = generateCodeSchema.parse(req.body)

  await deductCredits(req.user.id, parseInt(process.env.CREDIT_COST_AI_CALL || '2'))

  const code = await aiService.generateCode(prompt, context)

  res.json({ code })
})

export const editComponent = asyncHandler(async (req: Request, res: Response) => {
  const { componentCode, instruction } = editComponentSchema.parse(req.body)

  await deductCredits(req.user.id, parseInt(process.env.CREDIT_COST_EDIT_COMPONENT || '5'))

  const updatedCode = await aiService.editComponent(componentCode, instruction)

  res.json({ code: updatedCode })
})

export const analyzeImage = asyncHandler(async (req: Request, res: Response) => {
  const { imageUrl } = analyzeImageSchema.parse(req.body)

  await deductCredits(req.user.id, parseInt(process.env.CREDIT_COST_AI_CALL || '2'))

  const analysis = await aiService.analyzeImage(imageUrl)

  res.json({ analysis })
})
