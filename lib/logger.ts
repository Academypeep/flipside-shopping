export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogPayload {
  level: LogLevel
  message: string
  timestamp: string
  requestId?: string
  context?: Record<string, unknown>
  error?: {
    name: string
    message: string
    stack?: string
  }
}

class StructuredLogger {
  private redact(obj: Record<string, unknown>): Record<string, unknown> {
    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'authorization',
      'cookie',
      'credit_card',
      'cvv',
      'phone',
      'privatekey',
    ]
    const result: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
        result[key] = '[REDACTED]'
      } else if (value && typeof value === 'object') {
        if (Array.isArray(value)) {
          result[key] = value.map((v) =>
            v && typeof v === 'object' ? this.redact(v as Record<string, unknown>) : v,
          )
        } else {
          result[key] = this.redact(value as Record<string, unknown>)
        }
      } else {
        result[key] = value
      }
    }
    return result
  }

  private format(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): string {
    const payload: LogPayload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: context ? this.redact(context) : undefined,
    }

    if (error) {
      payload.error = {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      }
    }

    return JSON.stringify(payload)
  }

  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.format('debug', message, context))
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    console.info(this.format('info', message, context))
  }

  warn(message: string, context?: Record<string, unknown>) {
    console.warn(this.format('warn', message, context))
  }

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>) {
    const err = error instanceof Error ? error : error ? new Error(String(error)) : undefined
    console.error(this.format('error', message, context, err))
  }
}

export const logger = new StructuredLogger()
