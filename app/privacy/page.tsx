import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy — Flipside', description: 'How Flipside handles information.' }

export default function PrivacyPage() {
  return <main className="min-h-screen bg-[#0d0d0d] px-6 py-16 text-white"><article className="mx-auto max-w-2xl"><a href="/" className="text-sm text-[#ee642b]">← Back to Flipside</a><h1 className="mt-10 text-4xl font-semibold tracking-tight">Privacy</h1><p className="mt-4 text-white/60">This page is a launch placeholder. Before collecting account, request, or payment data, publish a complete privacy notice describing data collection, retention, processors, user rights, and contact details.</p><h2 className="mt-10 text-xl font-semibold">Contact</h2><p className="mt-3 text-white/60">Add a monitored privacy contact before launch.</p></article></main>
}
