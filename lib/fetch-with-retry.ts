/**
 * Production-grade fetch with timeout, exponential backoff retries with jitter, and circuit breaker.
 */

export interface FetchWithRetryOptions extends RequestInit {
  timeoutMs?: number
  maxRetries?: number
  initialDelayMs?: number
  backoffFactor?: number
  jitter?: boolean
  retryCondition?: (response: Response | null, error: unknown) => boolean
}

class CircuitBreaker {
  private failureThreshold = 5
  private resetTimeoutMs = 30000
  private failureCount = 0
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  private lastFailureTime = 0

  public canExecute(): boolean {
    if (this.state === 'OPEN') {
      const now = Date.now()
      if (now - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = 'HALF_OPEN'
        return true
      }
      return false
    }
    return true
  }

  public recordSuccess(): void {
    this.failureCount = 0
    this.state = 'CLOSED'
  }

  public recordFailure(): void {
    this.failureCount += 1
    this.lastFailureTime = Date.now()
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN'
    }
  }

  public getState(): string {
    return this.state
  }
}

export const circuitBreaker = new CircuitBreaker()

export async function fetchWithRetry(
  url: string,
  options: FetchWithRetryOptions = {},
): Promise<Response> {
  const {
    timeoutMs = 8000,
    maxRetries = 3,
    initialDelayMs = 300,
    backoffFactor = 2,
    jitter = true,
    retryCondition = (res, err) => {
      if (err) return true
      if (res && (res.status >= 500 || res.status === 429)) return true
      return false
    },
    ...fetchOptions
  } = options

  if (!circuitBreaker.canExecute()) {
    throw new Error('Circuit breaker is OPEN: outbound requests temporarily halted')
  }

  let attempt = 0
  let delay = initialDelayMs

  while (attempt <= maxRetries) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })

      clearTimeout(timer)

      if (response.ok || !retryCondition(response, null) || attempt === maxRetries) {
        circuitBreaker.recordSuccess()
        return response
      }

      // If condition demands retry
      circuitBreaker.recordFailure()
    } catch (error: unknown) {
      clearTimeout(timer)
      circuitBreaker.recordFailure()

      if (attempt === maxRetries || !retryCondition(null, error)) {
        throw error
      }
    }

    attempt += 1
    const jitterOffset = jitter ? Math.random() * delay * 0.3 : 0
    const sleepTime = delay + jitterOffset
    await new Promise((resolve) => setTimeout(resolve, sleepTime))
    delay *= backoffFactor
  }

  throw new Error(`Failed request to ${url} after ${maxRetries} retries`)
}
