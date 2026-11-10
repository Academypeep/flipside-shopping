import { ToastProvider } from '@/components/ui/toast'
import { ErrorBoundary } from '@/components/error-boundary'
import FlipsideDashboard from '@/components/flipside-dashboard'

export default function Page() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <FlipsideDashboard />
      </ToastProvider>
    </ErrorBoundary>
  )
}
