import { Request, Response } from 'express'
import { z } from 'zod'
import Stripe from 'stripe'
import { prisma } from '../config/database'
import { asyncHandler } from '../middleware/errorHandler'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
})

const createCheckoutSchema = z.object({
  priceId: z.string(),
})

export const getPlans = asyncHandler(async (req: Request, res: Response) => {
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 47,
      currency: 'BRL',
      credits: 500,
      features: [
        '5 projetos',
        'Deploy ilimitado',
        'SSL automático',
        'Suporte por email',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 97,
      currency: 'BRL',
      credits: 2000,
      features: [
        '20 projetos',
        'Deploy ilimitado',
        'SSL automático',
        'Domínio personalizado',
        'Suporte prioritário',
        'Exportar código',
      ],
      popular: true,
    },
    {
      id: 'scale',
      name: 'Scale',
      price: 297,
      currency: 'BRL',
      credits: 10000,
      features: [
        'Projetos ilimitados',
        'Deploy ilimitado',
        'SSL automático',
        'Domínio personalizado',
        'Suporte dedicado',
        'Exportar código',
        'Integração GitHub',
        'Whitelabel',
      ],
    },
  ]

  res.json(plans)
})

export const createCheckoutSession = asyncHandler(
  async (req: Request, res: Response) => {
    const { priceId } = createCheckoutSchema.parse(req.body)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/settings?canceled=true`,
      client_reference_id: req.user.id,
    })

    res.json({ url: session.url })
  }
)

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  res.json(transactions)
})

export const stripeWebhook = asyncHandler(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      // Handle successful payment
      break
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
})
