import { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../config/database'
import { asyncHandler } from '../middleware/errorHandler'

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: z.string().url().optional(),
})

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      credits: true,
      avatar: true,
      createdAt: true,
    },
  })

  res.json(user)
})

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const data = updateProfileSchema.parse(req.body)

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      credits: true,
      avatar: true,
    },
  })

  res.json(user)
})

export const getCredits = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { credits: true },
  })

  res.json({ credits: user?.credits || 0 })
})

export const getUsage = asyncHandler(async (req: Request, res: Response) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId: req.user.id,
      type: 'CREDIT_USAGE',
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const totalUsed = transactions.reduce((sum, t) => sum + (t.credits || 0), 0)

  res.json({
    totalUsed,
    transactions,
  })
})
