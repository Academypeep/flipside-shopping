interface RateLimitRecord {
  count: number
  resetTime: number
}

class MemoryRateLimiter {
  private records = new Map<string, RateLimitRecord>()

  /**
   * Check and consume rate limit for a client key
   * @param key Client IP or user identifier
   * @param limit Maximum requests allowed in window
   * @param windowMs Time window in milliseconds (default: 60_000ms / 1 min)
   */
  check(key: string, limit = 60, windowMs = 60_000): {
    success: boolean
    limit: number
    remaining: number
    reset: number
  } {
    const now = Date.now()
    const record = this.records.get(key)

    if (!record || now > record.resetTime) {
      const resetTime = now + windowMs
      this.records.set(key, { count: 1, resetTime })
      this.cleanup(now)
      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: Math.ceil(resetTime / 1000),
      }
    }

    if (record.count >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset: Math.ceil(record.resetTime / 1000),
      }
    }

    record.count += 1
    return {
      success: true,
      limit,
      remaining: limit - record.count,
      reset: Math.ceil(record.resetTime / 1000),
    }
  }

  private cleanup(now: number) {
    if (this.records.size > 10_000) {
      for (const [k, v] of this.records.entries()) {
        if (now > v.resetTime) {
          this.records.delete(k)
        }
      }
    }
  }
}

export const rateLimiter = new MemoryRateLimiter()
