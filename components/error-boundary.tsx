'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-red-500/10 text-red-500">
            <AlertTriangle size={28} />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-white">Something went wrong</h2>
          <p className="mt-2 max-w-md text-sm text-neutral-400">
            We encountered an unexpected error while loading this component. Please try reloading or check back shortly.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ee642b] px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-[#d9531e]"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
