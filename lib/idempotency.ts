/**
 * In-memory Idempotency Store to prevent duplicate requests from mobile cellular retries and double taps.
 */

interface CachedResponse {
  statusCode: number
  headers: Record<string, string>
  body: string
  timestamp: number
}

class IdempotencyStore {
  private cache = new Map<string, CachedResponse>()
  private inFlight = new Set<string>()
  private ttlMs = 120000 // 2 minutes

  public checkInFlight(key: string): boolean {
    return this.inFlight.has(key)
  }

  public setInFlight(key: string): void {
    this.inFlight.add(key)
  }

  public clearInFlight(key: string): void {
    this.inFlight.delete(key)
  }

  public get(key: string): CachedResponse | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > this.ttlMs) {
      this.cache.delete(key)
      return null
    }

    return item
  }

  public set(
    key: string,
    statusCode: number,
    headers: Record<string, string>,
    body: string,
  ): void {
    this.inFlight.delete(key)
    this.cache.set(key, {
      statusCode,
      headers,
      body,
      timestamp: Date.now(),
    })
  }

  public clear(): void {
    this.cache.clear()
    this.inFlight.clear()
  }
}

export const idempotencyStore = new IdempotencyStore()
