import { NextResponse } from 'next/server'

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  meta?: {
    total?: number
    page?: number
    limit?: number
    requestId?: string
    timestamp: string
  }
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  meta: {
    requestId?: string
    timestamp: string
  }
}

export function successResponse<T>(
  data: T,
  meta?: { total?: number; page?: number; limit?: number; requestId?: string },
  init?: ResponseInit,
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        ...meta,
        timestamp: new Date().toISOString(),
      },
    },
    {
      status: init?.status ?? 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        ...init?.headers,
      },
    },
  )
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
  details?: unknown,
  requestId?: string,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
      meta: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    },
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    },
  )
}
