import { NextRequest } from 'next/server'
import { successResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const reqId = request.headers.get('x-request-id') ?? crypto.randomUUID()
  const clientVersion = request.nextUrl.searchParams.get('client_version') ?? '1.0.0'

  const currentVersion = '1.0.0'
  const minSupportedVersion = '1.0.0'

  return successResponse({
    currentVersion,
    minSupportedVersion,
    isDeprecated: false,
    updateRequired: false,
    updateUrl: 'https://flipside.market/download',
    releaseNotes: 'Production launch release with reverse marketplace bidding and instant offers.',
  }, { requestId: reqId })
}
