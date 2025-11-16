import { prisma } from '../config/database'
import { AppError } from '../middleware/errorHandler'

export async function deductCredits(
  userId: string,
  amount: number,
  description?: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  })

  if (!user) {
    throw new AppError('User not found', 404)
  }

  if (user.credits < amount) {
    throw new AppError('Insufficient credits', 402)
  }

  // Deduct credits and create transaction
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: amount,
        },
      },
    }),
    prisma.transaction.create({
      data: {
        userId,
        type: 'CREDIT_USAGE',
        amount: -amount,
        credits: -amount,
        description: description || 'Credit usage',
      },
    }),
  ])

  console.log(`✅ Deducted ${amount} credits from user ${userId}`)
}

export async function addCredits(
  userId: string,
  amount: number,
  description?: string,
  stripeId?: string
): Promise<void> {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          increment: amount,
        },
      },
    }),
    prisma.transaction.create({
      data: {
        userId,
        type: 'CREDIT_PURCHASE',
        amount,
        credits: amount,
        description: description || 'Credit purchase',
        stripeId,
      },
    }),
  ])

  console.log(`✅ Added ${amount} credits to user ${userId}`)
}

export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  })

  return user?.credits || 0
}
