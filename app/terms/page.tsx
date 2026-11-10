import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | Flipside Reverse Marketplace',
  description: 'Flipside Terms of Service and Buyer/Seller Agreements',
}

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center text-orange-400 hover:text-orange-300 text-sm font-medium">
          &larr; Back to Marketplace
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Terms of Service</h1>
        <p className="text-sm text-neutral-400">Last updated: April 2025</p>

        <section className="space-y-4 text-neutral-300 leading-relaxed text-sm">
          <h2 className="text-lg font-semibold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or downloading Flipside, you agree to comply with and be bound by these Terms of Service.
            If you do not agree, do not use the application.
          </p>

          <h2 className="text-lg font-semibold text-white">2. Reverse Marketplace Rules</h2>
          <p>
            Buyers post legitimate purchasing requests with genuine intent to buy within their stated budget.
            Sellers guarantee that all goods offered are genuine, accurately represented, and delivered according to agreed timelines.
          </p>

          <h2 className="text-lg font-semibold text-white">3. Escrow and Payment Protection</h2>
          <p>
            Payments are held securely in escrow until the buyer confirms delivery and satisfactory inspection of the item.
            Disputes are handled through our dedicated support resolution process.
          </p>

          <h2 className="text-lg font-semibold text-white">4. Prohibited Items & Conduct</h2>
          <p>
            Listing illegal products, counterfeit goods, hazardous materials, or engaging in off-platform payment evasion
            will result in immediate account termination and forfeiture of pending balances.
          </p>
        </section>
      </div>
    </main>
  )
}
