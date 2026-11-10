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
  private format(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): string {
    const payload: LogPayload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
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
