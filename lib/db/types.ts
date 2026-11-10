import { z } from 'zod'

export const CategoryEnum = z.enum([
  'Electronics',
  'Home & Living',
  'Fashion',
  'Vehicles',
  'Services',
])

export type Category = z.infer<typeof CategoryEnum>

export const MarketRequestSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3).max(120),
  category: CategoryEnum,
  location: z.string().min(2).max(100),
  budget: z.string().min(1).max(50),
  budgetAmount: z.number().nonnegative().optional(),
  currency: z.string().default('KES'),
  offers: z.number().int().nonnegative().default(0),
  time: z.string(),
  initials: z.string().min(1).max(3),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  createdAt: z.string().datetime(),
  description: z.string().max(500).optional(),
})

export type MarketRequest = z.infer<typeof MarketRequestSchema>

export const CreateRequestInputSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120, 'Title too long'),
  category: CategoryEnum.default('Electronics'),
  location: z.string().trim().min(2, 'Location is required').default('Nairobi, KE'),
  budget: z.string().trim().min(1, 'Budget is required'),
  description: z.string().trim().max(500).optional(),
})

export type CreateRequestInput = z.infer<typeof CreateRequestInputSchema>

export const OfferSchema = z.object({
  id: z.string().uuid(),
  requestId: z.number().int().positive(),
  amount: z.number().positive(),
  sellerName: z.string().min(2),
  notes: z.string().max(500).optional(),
  createdAt: z.string().datetime(),
})

export type Offer = z.infer<typeof OfferSchema>

export const CreateOfferInputSchema = z.object({
  amount: z.number().positive('Offer amount must be greater than zero'),
  sellerName: z.string().trim().min(2, 'Seller name required'),
  notes: z.string().trim().max(500).optional(),
})

export type CreateOfferInput = z.infer<typeof CreateOfferInputSchema>

export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
})

export type AuthUser = z.infer<typeof AuthUserSchema>
