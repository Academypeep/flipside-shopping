import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Terms — Flipside', description: 'Terms for using Flipside.' }

export default function TermsPage() {
  return <main className="min-h-screen bg-[#0d0d0d] px-6 py-16 text-white"><article className="mx-auto max-w-2xl"><a href="/" className="text-sm text-[#ee642b]">← Back to Flipside</a><h1 className="mt-10 text-4xl font-semibold tracking-tight">Terms</h1><p className="mt-4 text-white/60">This page is a launch placeholder. Before launch, publish rules for offers, transactions, prohibited conduct, disputes, refunds, account termination, and applicable law.</p><h2 className="mt-10 text-xl font-semibold">Support</h2><p className="mt-3 text-white/60">Add a monitored support channel and response expectations before accepting users.</p></article></main>
}
