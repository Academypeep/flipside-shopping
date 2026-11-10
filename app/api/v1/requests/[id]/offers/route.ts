import { NextRequest } from 'next/server'
import { errorResponse, successResponse } from '@/lib/api-response'
import { marketplaceStore } from '@/lib/db/marketplace-store'
import { CreateOfferInputSchema } from '@/lib/db/types'
import { logger } from '@/lib/logger'
import { rateLimiter } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()
  const { id } = await params
  const numericId = parseInt(id, 10)

  if (isNaN(numericId) || numericId <= 0) {
    return errorResponse('INVALID_ID', 'Request ID must be a positive integer', 400, undefined, requestId)
  }

  try {
    const requestItem = await marketplaceStore.findById(numericId)
    if (!requestItem) {
      return errorResponse('NOT_FOUND', `Request with ID ${numericId} not found`, 404, undefined, requestId)
    }

    const offers = await marketplaceStore.getOffers(numericId)
    return successResponse(offers, { requestId, total: offers.length })
  } catch (err) {
    logger.error('Failed to get offers', err, { requestId, id: numericId })
    return errorResponse('INTERNAL_SERVER_ERROR', 'Could not retrieve offers', 500, undefined, requestId)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()
  const { id } = await params
  const numericId = parseInt(id, 10)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1'

  if (isNaN(numericId) || numericId <= 0) {
    return errorResponse('INVALID_ID', 'Request ID must be a positive integer', 400, undefined, requestId)
  }

  // Rate limit: 20 offers per minute per IP
  const rateLimitResult = rateLimiter.check(`post_offer_${ip}`, 20, 60_000)
  if (!rateLimitResult.success) {
    return errorResponse(
      'RATE_LIMITED',
      'Too many offers submitted. Please wait before offering again.',
      429,
      { retryAfter: rateLimitResult.reset },
      requestId,
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('INVALID_JSON', 'Malformed JSON payload in request body', 400, undefined, requestId)
  }

  const validation = CreateOfferInputSchema.safeParse(body)
  if (!validation.success) {
    return errorResponse(
      'VALIDATION_ERROR',
      'Invalid offer payload',
      422,
      validation.error.flatten().fieldErrors,
      requestId,
    )
  }

  try {
    const offer = await marketplaceStore.addOffer(numericId, validation.data)
    logger.info('Marketplace offer posted', { requestId, id: numericId, offerId: offer.id })
    return successResponse(offer, { requestId }, { status: 201 })
  } catch (err: unknown) {
    const error = err as Error
    if (error.message.includes('not found')) {
      return errorResponse('NOT_FOUND', error.message, 404, undefined, requestId)
    }
    logger.error('Failed to post offer', err, { requestId, id: numericId })
    return errorResponse('INTERNAL_SERVER_ERROR', 'Could not submit offer', 500, undefined, requestId)
  }
}
