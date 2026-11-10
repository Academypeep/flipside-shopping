import { NextRequest } from 'next/server'
import { z } from 'zod'
import { errorResponse, successResponse } from '@/lib/api-response'
import { logger } from '@/lib/logger'
import { rateLimiter } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const SignInSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID()
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1'

  // Strict rate limit for auth endpoints: 5 attempts per minute per IP
  const rateLimitResult = rateLimiter.check(`auth_login_${ip}`, 5, 60_000)
  if (!rateLimitResult.success) {
    logger.warn('Auth brute-force prevention triggered', { requestId, ip })
    return errorResponse(
      'RATE_LIMITED',
      'Too many sign-in attempts. Please try again in a few moments.',
      429,
      { retryAfter: rateLimitResult.reset },
      requestId,
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('INVALID_JSON', 'Malformed JSON payload', 400, undefined, requestId)
  }

  const validation = SignInSchema.safeParse(body)
  if (!validation.success) {
    return errorResponse(
      'VALIDATION_ERROR',
      'Validation failed',
      422,
      validation.error.flatten().fieldErrors,
      requestId,
    )
  }

  const { email } = validation.data

  logger.info('User session created', { requestId, email })

  const user = {
    id: `usr_${crypto.randomUUID().slice(0, 8)}`,
    email,
    name: email.split('@')[0],
  }

  return successResponse(
    {
      user,
      token: `flipside_${crypto.randomUUID()}`,
      expiresIn: 86400,
    },
    { requestId },
    {
      headers: {
        'Set-Cookie': `flipside_session=${user.id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400; Secure`,
      },
    },
  )
}
