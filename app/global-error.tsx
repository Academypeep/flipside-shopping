"use client"

import { useEffect } from "react"

export default function GlobalError({ reset }: { reset: () => void }) {
  useEffect(() => {
    console.error("[Flipside] A fatal application error occurred")
  }, [])

  return (
    <html lang="en">
      <body className="bg-[#0d0d0d] text-white">
        <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-5 px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#ee642b]">Flipside</p>
          <h1 className="text-3xl font-bold tracking-tight">Something went wrong.</h1>
          <p className="text-white/65">The app could not finish loading. Try again, or contact support if the problem continues.</p>
          <button className="rounded-full bg-[#ee642b] px-5 py-3 font-bold text-white" onClick={() => reset()}>
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
