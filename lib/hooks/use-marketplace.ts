'use client'

import { useCallback, useEffect, useState } from 'react'
import { MarketRequest } from '@/lib/db/types'

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

      const res = await fetch(`/api/v1/requests?${params.toString()}`)
      if (!res.ok) {
        throw new Error(`Failed to load requests (${res.status})`)
      }
      const data = await res.json()
      if (data.success) {
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
    const res = await fetch('/api/v1/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const json = await res.json()
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message ?? 'Failed to create request')
    }

    // Prepend newly created item optimistically
    setState((prev) => ({
      ...prev,
      items: [json.data, ...prev.items],
      total: prev.total + 1,
    }))

    return json.data as MarketRequest
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
