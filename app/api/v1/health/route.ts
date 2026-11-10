import { NextRequest } from 'next/server'
import { successResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()
  const uptime = process.uptime()
  const memoryUsage = process.memoryUsage()

  return successResponse(
    {
      status: 'healthy',
      service: 'flipside-marketplace-api',
      version: '1.0.0',
      uptimeSeconds: Math.floor(uptime),
      timestamp: new Date().toISOString(),
      memory: {
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
      },
    },
    { requestId },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  )
}
