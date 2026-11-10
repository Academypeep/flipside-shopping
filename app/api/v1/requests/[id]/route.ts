import { NextRequest } from 'next/server'
import { errorResponse, successResponse } from '@/lib/api-response'
import { marketplaceStore } from '@/lib/db/marketplace-store'
import { logger } from '@/lib/logger'

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
    const item = await marketplaceStore.findById(numericId)
    if (!item) {
      return errorResponse('NOT_FOUND', `Request with ID ${numericId} not found`, 404, undefined, requestId)
    }

    const offers = await marketplaceStore.getOffers(numericId)
    return successResponse({ ...item, offerList: offers }, { requestId })
  } catch (err) {
    logger.error('Failed to get request details', err, { requestId, id: numericId })
    return errorResponse('INTERNAL_SERVER_ERROR', 'Could not retrieve request', 500, undefined, requestId)
  }
}
