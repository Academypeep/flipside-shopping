import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Support — Flipside', description: 'Get help with Flipside.' }

export default function SupportPage() {
  return <main className="min-h-screen bg-[#0d0d0d] px-6 py-16 text-white"><article className="mx-auto max-w-2xl"><a href="/" className="text-sm text-[#ee642b]">← Back to Flipside</a><h1 className="mt-10 text-4xl font-semibold tracking-tight">Support</h1><p className="mt-4 text-white/60">Support is not connected yet. Before launch, replace this page with a monitored help channel, incident status link, and escalation path.</p><a className="mt-8 inline-flex rounded-full bg-[#ee642b] px-5 py-3 text-sm font-semibold text-white" href="mailto:support@example.com">Contact support</a></article></main>
}
