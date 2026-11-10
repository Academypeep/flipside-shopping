/**
 * Client-side and server-side production analytics and telemetry tracker.
 */

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, unknown>
  userId?: string
  timestamp?: string
}

export interface CrashReport {
  message: string
  stack?: string
  url?: string
  userAgent?: string
  timestamp: string
}

class Telemetry {
  private queue: AnalyticsEvent[] = []
  private crashQueue: CrashReport[] = []

  public track(event: string, properties?: Record<string, unknown>, userId?: string): void {
    const payload: AnalyticsEvent = {
      event,
      properties,
      userId,
      timestamp: new Date().toISOString(),
    }
    this.queue.push(payload)
    if (this.queue.length > 200) {
      this.queue.shift()
    }
  }

  public reportCrash(error: Error | string, context?: Record<string, unknown>): void {
    const report: CrashReport = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      timestamp: new Date().toISOString(),
    }
    this.crashQueue.push(report)
    if (this.crashQueue.length > 50) {
      this.crashQueue.shift()
    }
  }

  public getEvents(): AnalyticsEvent[] {
    return [...this.queue]
  }

  public getCrashes(): CrashReport[] {
    return [...this.crashQueue]
  }
}

export const telemetry = new Telemetry()
