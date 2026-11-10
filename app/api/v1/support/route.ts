import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-response'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { rateLimiter } from '@/lib/rate-limit'
import { sanitizeText } from '@/lib/sanitize'

export const dynamic = 'force-dynamic'

const SupportTicketSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  category: z.enum(['dispute', 'bug', 'billing', 'fraud', 'general']),
  message: z.string().min(10).max(2000),
  requestId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const reqId = request.headers.get('x-request-id') ?? crypto.randomUUID()
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1'

  const rateCheck = rateLimiter.check(`support_${ip}`, 10, 60_000)
  if (!rateCheck.success) {
    return errorResponse('RATE_LIMITED', 'Too many support requests submitted', 429, undefined, reqId)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('INVALID_JSON', 'Malformed JSON payload', 400, undefined, reqId)
  }

  const validation = SupportTicketSchema.safeParse(body)
  if (!validation.success) {
    return errorResponse('VALIDATION_ERROR', 'Invalid support ticket payload', 422, validation.error.flatten().fieldErrors, reqId)
  }

  const ticketId = `ticket_${crypto.randomUUID()}`
  logger.info('Support ticket created', {
    ticketId,
    category: validation.data.category,
    email: validation.data.email,
    requestIdParam: validation.data.requestId,
  })

  return successResponse({
    ticketId,
    status: 'SUBMITTED',
    category: validation.data.category,
    message: sanitizeText(validation.data.message),
    estimatedResponseTime: '24 hours',
  }, { requestId: reqId }, { status: 201 })
}
