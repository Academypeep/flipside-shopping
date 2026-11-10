import { NextRequest, NextResponse } from 'next/server'
import { errorResponse, successResponse } from '@/lib/api-response'
import { marketplaceStore } from '@/lib/db/marketplace-store'
import { CreateRequestInputSchema } from '@/lib/db/types'
import { idempotencyStore } from '@/lib/idempotency'
import { logger } from '@/lib/logger'
import { rateLimiter } from '@/lib/rate-limit'
import { sanitizeText } from '@/lib/sanitize'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category') ?? undefined
  const query = searchParams.get('query') ?? undefined
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 12

  try {
    const result = await marketplaceStore.list({ category, query, page, limit })
    return successResponse(result.items, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      requestId,
    })
  } catch (err) {
    logger.error('Failed to list requests', err, { requestId, category, query })
    return errorResponse('INTERNAL_SERVER_ERROR', 'Unable to retrieve marketplace requests', 500, undefined, requestId)
  }
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1'

  // Apply rate limiter: 30 new requests per minute per IP
  const rateLimitResult = rateLimiter.check(`post_req_${ip}`, 30, 60_000)
  if (!rateLimitResult.success) {
    return errorResponse(
      'RATE_LIMITED',
      'Too many requests created. Please try again later.',
      429,
      { retryAfter: rateLimitResult.reset },
      requestId,
    )
  }

  const idempotencyKey = request.headers.get('x-idempotency-key')
  if (idempotencyKey) {
    if (idempotencyStore.checkInFlight(idempotencyKey)) {
      return errorResponse('CONFLICT', 'A request with this idempotency key is already in flight', 409, undefined, requestId)
    }
    const cached = idempotencyStore.get(idempotencyKey)
    if (cached) {
      return new NextResponse(cached.body, {
        status: cached.statusCode,
        headers: { ...cached.headers, 'x-idempotency-replayed': 'true', 'x-request-id': requestId },
      })
    }
    idempotencyStore.setInFlight(idempotencyKey)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    if (idempotencyKey) idempotencyStore.clearInFlight(idempotencyKey)
    return errorResponse('INVALID_JSON', 'Malformed JSON payload in request body', 400, undefined, requestId)
  }

  const validation = CreateRequestInputSchema.safeParse(body)
  if (!validation.success) {
    if (idempotencyKey) idempotencyStore.clearInFlight(idempotencyKey)
    return errorResponse(
      'VALIDATION_ERROR',
      'Invalid request payload',
      422,
      validation.error.flatten().fieldErrors,
      requestId,
    )
  }

  try {
    const sanitizedData = {
      ...validation.data,
      title: sanitizeText(validation.data.title),
      description: validation.data.description ? sanitizeText(validation.data.description) : undefined,
      location: sanitizeText(validation.data.location),
    }

    const newRequest = await marketplaceStore.create(sanitizedData)
    logger.info('Marketplace request created', { requestId, id: newRequest.id, title: newRequest.title })

    const response = successResponse(newRequest, { requestId }, { status: 201 })
    if (idempotencyKey) {
      idempotencyStore.set(
        idempotencyKey,
        201,
        { 'Content-Type': 'application/json' },
        JSON.stringify({ status: 'success', data: newRequest, meta: { requestId } }),
      )
    }
    return response
  } catch (err) {
    if (idempotencyKey) idempotencyStore.clearInFlight(idempotencyKey)
    logger.error('Failed to create request', err, { requestId })
    return errorResponse('INTERNAL_SERVER_ERROR', 'Could not create marketplace request', 500, undefined, requestId)
  }
}
