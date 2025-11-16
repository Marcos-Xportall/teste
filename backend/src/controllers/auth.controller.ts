import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../config/database'
import { AppError, asyncHandler } from '../middleware/errorHandler'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = registerSchema.parse(req.body)

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new AppError('Email already registered', 400)
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      credits: parseInt(process.env.DEFAULT_FREE_CREDITS || '100'),
    },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      credits: true,
      avatar: true,
    },
  })

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

  res.status(201).json({
    user,
    token,
  })
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body)

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new AppError('Invalid credentials', 401)
  }

  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password)

  if (!isValidPassword) {
    throw new AppError('Invalid credentials', 401)
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      credits: user.credits,
      avatar: user.avatar,
    },
    token,
  })
})

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.json({ user: req.user })
})

export const logout = asyncHandler(async (req: Request, res: Response) => {
  // In a real app, you might want to blacklist the token
  res.json({ message: 'Logged out successfully' })
})
