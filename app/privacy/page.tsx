import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Flipside Reverse Marketplace',
  description: 'Flipside Privacy Policy and Data Protection Disclosures',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center text-orange-400 hover:text-orange-300 text-sm font-medium">
          &larr; Back to Marketplace
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Privacy Policy</h1>
        <p className="text-sm text-neutral-400">Last updated: April 2025</p>

        <section className="space-y-4 text-neutral-300 leading-relaxed text-sm">
          <h2 className="text-lg font-semibold text-white">1. Information We Collect</h2>
          <p>
            When you use Flipside, we collect personal information such as your name, email address, physical location
            for marketplace logistics, and payment details processed securely via PCI-DSS compliant payment gateways.
          </p>

          <h2 className="text-lg font-semibold text-white">2. How We Use Information</h2>
          <p>
            We use your data to facilitate reverse-auction bidding, verify buyer requests and seller offers, prevent
            fraudulent listings, and notify you of order statuses.
          </p>

          <h2 className="text-lg font-semibold text-white">3. Data Sharing & Security</h2>
          <p>
            We do not sell your personal information. Seller contact details and payment disbursement information are
            only shared between parties once an offer is formally accepted.
          </p>

          <h2 className="text-lg font-semibold text-white">4. Account Deletion Rights</h2>
          <p>
            In accordance with App Store guidelines and international data privacy laws (GDPR, CCPA), you may request
            permanent deletion of your account and associated bid records at any time by contacting{' '}
            <a href="mailto:privacy@flipside.market" className="text-orange-400 underline">
              privacy@flipside.market
            </a>.
          </p>
        </section>
      </div>
    </main>
  )
}
