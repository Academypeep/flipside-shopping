import { NextRequest } from 'next/server'
import { errorResponse, successResponse } from '@/lib/api-response'
import { marketplaceStore } from '@/lib/db/marketplace-store'
import { CreateRequestInputSchema } from '@/lib/db/types'
import { logger } from '@/lib/logger'
import { rateLimiter } from '@/lib/rate-limit'

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

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('INVALID_JSON', 'Malformed JSON payload in request body', 400, undefined, requestId)
  }

  const validation = CreateRequestInputSchema.safeParse(body)
  if (!validation.success) {
    return errorResponse(
      'VALIDATION_ERROR',
      'Invalid request payload',
      422,
      validation.error.flatten().fieldErrors,
      requestId,
    )
  }

  try {
    const newRequest = await marketplaceStore.create(validation.data)
    logger.info('Marketplace request created', { requestId, id: newRequest.id, title: newRequest.title })
    return successResponse(newRequest, { requestId }, { status: 201 })
  } catch (err) {
    logger.error('Failed to create request', err, { requestId })
    return errorResponse('INTERNAL_SERVER_ERROR', 'Could not create marketplace request', 500, undefined, requestId)
  }
}
