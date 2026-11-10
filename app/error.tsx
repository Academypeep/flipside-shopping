'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Flipside] Route error', error)
  }, [error])

  return (
    <main className="grid min-h-screen place-items-center bg-[#0d0d0d] px-6 text-center text-white">
      <section className="max-w-md">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#ee642b]">Flipside</p>
        <h1 className="text-3xl font-semibold tracking-tight">Something went wrong.</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">The page could not load. Try again, or return to the marketplace.</p>
        <div className="mt-7 flex justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-full bg-[#ee642b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d95320]">Try again</button>
          <a href="/" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10">Go home</a>
        </div>
      </section>
    </main>
  )
}
