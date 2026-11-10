'use client'

import { useCallback, useEffect, useState } from 'react'
import { MarketRequest } from '@/lib/db/types'
import { fetchWithRetry } from '@/lib/fetch-with-retry'
import { telemetry } from '@/lib/telemetry'

interface MarketplaceState {
  items: MarketRequest[]
  total: number
  loading: boolean
  error: string | null
}

export function useMarketplace(activeCategory: string, query: string) {
  const [state, setState] = useState<MarketplaceState>({
    items: [],
    total: 0,
    loading: true,
    error: null,
  })

  const fetchRequests = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const params = new URLSearchParams()
      if (activeCategory && activeCategory !== 'All requests') {
        params.set('category', activeCategory)
      }
      if (query.trim()) {
        params.set('query', query.trim())
      }

      const res = await fetchWithRetry(`/api/v1/requests?${params.toString()}`, {
        timeoutMs: 8000,
        maxRetries: 2,
      })
      if (!res.ok) {
        throw new Error(`Failed to load requests (${res.status})`)
      }
      const data = await res.json()
      if (data.success) {
        telemetry.track('marketplace_feed_loaded', { count: data.data.length, category: activeCategory })
        setState({
          items: data.data,
          total: data.meta?.total ?? data.data.length,
          loading: false,
          error: null,
        })
      } else {
        throw new Error(data.error?.message ?? 'Failed to load requests')
      }
    } catch (err: unknown) {
      const error = err as Error
      telemetry.reportCrash(error, { action: 'fetchRequests', activeCategory, query })
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'An unexpected error occurred while loading requests.',
      }))
    }
  }, [activeCategory, query])

  useEffect(() => {
    // Debounce search query to prevent excessive API load
    const timer = setTimeout(() => {
      fetchRequests()
    }, 200)

    return () => clearTimeout(timer)
  }, [fetchRequests])

  const createRequest = async (payload: { title: string; category?: string; budget: string; location?: string }) => {
    const idempotencyKey = crypto.randomUUID()
    try {
      const res = await fetchWithRetry('/api/v1/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-idempotency-key': idempotencyKey,
        },
        body: JSON.stringify(payload),
        timeoutMs: 10000,
        maxRetries: 2,
      })

      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message ?? 'Failed to create request')
      }

      telemetry.track('marketplace_request_created', { id: json.data.id, category: payload.category })

      // Prepend newly created item optimistically
      setState((prev) => ({
        ...prev,
        items: [json.data, ...prev.items],
        total: prev.total + 1,
      }))

      return json.data as MarketRequest
    } catch (err) {
      telemetry.reportCrash(err instanceof Error ? err : String(err), { action: 'createRequest' })
      throw err
    }
  }

  return {
    items: state.items,
    total: state.total,
    loading: state.loading,
    error: state.error,
    refresh: fetchRequests,
    createRequest,
  }
}
