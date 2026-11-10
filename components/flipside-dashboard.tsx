'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  Bell,
  ChevronDown,
  Clock3,
  Filter,
  Gavel,
  Heart,
  Loader2,
  MapPin,
  Moon,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  TrendingUp,
} from 'lucide-react'
import { useMarketplace } from '@/lib/hooks/use-marketplace'
import { useToast } from '@/components/ui/toast'
import { CategoryEnum } from '@/lib/db/types'

const categories = ['All requests', ...CategoryEnum.options]

export default function FlipsideDashboard() {
  const { showToast } = useToast()
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [activeCategory, setActiveCategory] = useState('All requests')
  const [query, setQuery] = useState('')
  const [liked, setLiked] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Sign-in modal state
  const [showSignIn, setShowSignIn] = useState(false)
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  const [signInError, setSignInError] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [userSession, setUserSession] = useState<{ name: string; email: string } | null>(null)

  // Composer modal state
  const [showComposer, setShowComposer] = useState(false)
  const [requestTitle, setRequestTitle] = useState('')
  const [requestCategory, setRequestCategory] = useState<string>('Electronics')
  const [requestLocation, setRequestLocation] = useState('Nairobi, KE')
  const [requestBudget, setRequestBudget] = useState('')
  const [requestDesc, setRequestDesc] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const signInEmailRef = useRef<HTMLInputElement>(null)
  const requestTitleRef = useRef<HTMLInputElement>(null)

  // Connected backend marketplace hook
  const { items, loading, error, refresh, createRequest } = useMarketplace(activeCategory, query)

  useEffect(() => {
    if (showSignIn) {
      signInEmailRef.current?.focus()
    }
  }, [showSignIn])

  useEffect(() => {
    if (showComposer) {
      requestTitleRef.current?.focus()
    }
  }, [showComposer])

  const openComposer = () => {
    setFormError('')
    setShowComposer(true)
  }

  const closeComposer = () => {
    setFormError('')
    setShowComposer(false)
  }

  const openSignIn = () => {
    setSignInError('')
    setShowSignIn(true)
  }

  const closeSignIn = () => {
    setSignInError('')
    setShowSignIn(false)
  }

  const submitSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signInEmail.trim() || !signInPassword.trim()) {
      setSignInError('Enter your email and password to continue.')
      return
    }

    setIsSigningIn(true)
    setSignInError('')
    try {
      const res = await fetch('/api/v1/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signInEmail, password: signInPassword }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Authentication failed')
      }

      setUserSession(data.data.user)
      showToast('Signed In', `Welcome back, ${data.data.user.name}!`, 'success')
      closeSignIn()
      setSignInEmail('')
      setSignInPassword('')
    } catch (err: unknown) {
      const error = err as Error
      setSignInError(error.message || 'Failed to sign in. Please verify your credentials.')
    } finally {
      setIsSigningIn(false)
    }
  }

  const publishRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestTitle.trim() || !requestBudget.trim()) {
      setFormError('Item title and budget are required.')
      return
    }

    setIsSubmitting(true)
    setFormError('')
    try {
      await createRequest({
        title: requestTitle.trim(),
        category: requestCategory,
        budget: requestBudget.trim(),
        location: requestLocation.trim(),
      })
      showToast('Request Published', 'Your request is now live in the marketplace!', 'success')
      closeComposer()
      setRequestTitle('')
      setRequestBudget('')
      setRequestDesc('')
    } catch (err: unknown) {
      const error = err as Error
      setFormError(error.message || 'Failed to publish request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleLike = (id: number, title: string) => {
    setLiked((current) => {
      const exists = current.includes(id)
      const next = exists ? current.filter((item) => item !== id) : [...current, id]
      showToast(
        exists ? 'Removed from saved' : 'Saved request',
        exists ? `Removed "${title}"` : `Saved "${title}" to your watchlist`,
        'info',
      )
      return next
    })
  }

  return (
    <main data-theme={theme} className="motion-page min-h-screen bg-[#0d0d0d] text-[#f5f5f5]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0d0d]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
          <a
            href="#top"
            className="flex items-center gap-2.5 text-[21px] font-semibold tracking-[-0.05em] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ee642b] rounded-lg"
          >
            <span className="grid size-8 place-items-center rounded-[10px] bg-[#ee642b] text-white">
              <Gavel size={17} strokeWidth={2.5} />
            </span>
            flipside<span className="text-[#ee642b]">.</span>
          </a>

          <nav className="hidden items-center gap-8 text-[13px] font-medium text-white/45 md:flex" aria-label="Main Navigation">
            <a className="text-white hover:text-white transition" href="#requests">
              Browse requests
            </a>
            <a className="hover:text-white transition" href="#how-it-works">
              How it works
            </a>
            <a className="hover:text-white transition" href="#safety">
              Trust & safety
            </a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              type="button"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 text-white/60 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#ee642b] outline-none"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              type="button"
              aria-label="Notifications"
              className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 text-white/60 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#ee642b] outline-none"
            >
              <Bell size={16} />
            </button>

            {userSession ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-2 text-[12px] font-semibold text-white">
                <span className="size-2 rounded-full bg-emerald-400" />
                {userSession.name}
              </span>
            ) : (
              <button
                type="button"
                onClick={openSignIn}
                className="min-h-10 shrink-0 rounded-full border border-white/20 px-3 py-2 text-[12px] font-semibold text-white hover:bg-white/10 sm:px-3.5 sm:text-[13px] focus-visible:ring-2 focus-visible:ring-[#ee642b] outline-none"
              >
                Sign in
              </button>
            )}

            <button
              type="button"
              onClick={openComposer}
              className="min-h-10 shrink-0 rounded-full bg-[#ee642b] px-3 py-2.5 text-[12px] font-semibold text-white shadow-sm hover:bg-[#d9531e] sm:px-4 sm:text-[13px] focus-visible:ring-2 focus-visible:ring-white outline-none"
            >
              <span className="hidden sm:inline">Post request</span>
              <span className="sm:hidden">Post</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="top" className="mx-auto max-w-[1240px] px-5 pb-12 pt-14 lg:px-8 lg:pb-16 lg:pt-20">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_410px]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ead8cc] bg-[#fffaf6] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ee642b]">
              <Sparkles size={13} /> Reverse marketplace platform
            </div>
            <h1 className="max-w-[760px] text-[clamp(3.5rem,8vw,7.2rem)] font-medium leading-[0.91] tracking-[-0.075em]">
              Name your price.<br />
              <span className="text-[#ee642b]">Make it happen.</span>
            </h1>
            <p className="mt-7 max-w-[510px] text-[17px] leading-7 text-white/55">
              Flipside is the reverse marketplace where buyers post what they need and verified sellers compete to give them the best deal.
            </p>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-[#171717] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-white">Have something in mind?</p>
                <p className="mt-1 text-[12px] text-white/50">Post a request in under a minute.</p>
              </div>
              <span className="grid size-9 place-items-center rounded-full bg-[#fff1e9] text-[#ee642b]">
                <Plus size={18} />
              </span>
            </div>
            <button
              type="button"
              onClick={openComposer}
              className="flex w-full items-center justify-center gap-2 rounded-[13px] bg-[#ee642b] py-3.5 text-[13px] font-semibold text-white hover:bg-[#d9531e] focus-visible:ring-2 focus-visible:ring-white outline-none transition"
            >
              <Plus size={16} /> Post a request
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#9b958b]">
              <ShieldCheck size={14} className="text-[#4e8a69]" /> Payments held safely until delivery
            </div>
          </div>
        </div>
      </section>

      {/* Requests Marketplace Section */}
      <section id="requests" className="border-t border-white/10 bg-[#111111]">
        <div className="mx-auto max-w-[1240px] px-5 py-10 lg:px-8 lg:py-14">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ee642b]">Live marketplace</p>
              <h2 className="text-3xl font-medium tracking-[-0.05em]">Open requests</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => refresh()}
                disabled={loading}
                aria-label="Refresh requests feed"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 disabled:opacity-50"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <p className="max-w-[300px] text-sm leading-6 text-[#8a847b] lg:text-right">
                Find a request you can fulfill, then send your best offer.
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mb-8 flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <label htmlFor="search-requests" className="sr-only">
                Search requests
              </label>
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa39a]" />
              <input
                id="search-requests"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for anything (e.g., iPhone, MacBook, apartment)..."
                className="h-12 w-full rounded-[13px] border border-[#e4dfd7] bg-[#faf9f7] pl-11 pr-4 text-sm outline-none transition focus:border-[#ee642b] focus:ring-2 focus:ring-[#ee642b]/20"
              />
            </div>
            <button
              type="button"
              aria-expanded={showFilters}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-12 items-center justify-center gap-2 rounded-[13px] border px-5 text-sm font-semibold transition ${
                showFilters
                  ? 'border-[#ee642b] bg-[#fff5ef] text-[#ee642b]'
                  : 'border-[#e4dfd7] text-[#746f67] hover:border-white/20'
              }`}
            >
              <Filter size={16} /> Filters <ChevronDown size={15} />
            </button>
          </div>

          {showFilters && (
            <div className="mb-6 rounded-[13px] border border-[#ead8cc] bg-[#fffaf6] p-4 text-sm text-[#746f67]">
              Showing active requests from verified buyers across East Africa. Filter by category below.
            </div>
          )}

          {/* Category Pills */}
          <div className="mb-9 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Request categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-semibold transition ${
                  activeCategory === category
                    ? 'bg-[#211f1b] text-white ring-2 ring-[#ee642b]'
                    : 'bg-[#f5f3ef] text-[#746f67] hover:bg-[#ebe7e0]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200">
              <span className="text-sm">{error}</span>
              <button
                type="button"
                onClick={() => refresh()}
                className="rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-semibold hover:bg-rose-500/30"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Skeleton State */}
          {loading && items.length === 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse rounded-[18px] border border-white/5 bg-[#171717] p-5">
                  <div className="mb-5 h-36 w-full rounded-[14px] bg-white/5" />
                  <div className="mb-4 flex items-center gap-3">
                    <div className="size-9 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/3 rounded bg-white/10" />
                      <div className="h-2 w-1/2 rounded bg-white/5" />
                    </div>
                  </div>
                  <div className="h-5 w-3/4 rounded bg-white/10" />
                  <div className="mt-6 flex justify-between border-t border-white/5 pt-4">
                    <div className="h-4 w-1/4 rounded bg-white/10" />
                    <div className="h-4 w-1/4 rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grid Feed */}
          {(!loading || items.length > 0) && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((request) => (
                <article
                  key={request.id}
                  className="group rounded-[18px] border border-[#e7e3dc] bg-[#fdfcfb] p-5 transition hover:-translate-y-1 hover:border-[#ee642b]/50 hover:shadow-[0_16px_35px_rgba(38,30,20,0.08)]"
                >
                  <div className="relative mb-5 h-36 w-full overflow-hidden rounded-[14px] bg-[#ebe7e0]">
                    <Image
                      src="/flipside-marketplace.png"
                      alt={`${request.title} product preview`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                      style={{ objectPosition: `${((request.id - 1) % 3) * 50}% ${request.id > 3 ? 100 : 0}%` }}
                    />
                  </div>

                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        style={{ backgroundColor: request.color }}
                        className="grid size-9 place-items-center rounded-full text-[11px] font-bold text-[#5e574e]"
                      >
                        {request.initials}
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold text-[#746f67]">{request.category}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[#aaa39a]">
                          <MapPin size={11} /> {request.location}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label={`Save ${request.title}`}
                      onClick={() => toggleLike(request.id, request.title)}
                      className="text-[#bcb6ae] transition hover:text-[#ee642b] p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ee642b] rounded-full"
                    >
                      <Heart size={18} fill={liked.includes(request.id) ? '#ee642b' : 'none'} color={liked.includes(request.id) ? '#ee642b' : 'currentColor'} />
                    </button>
                  </div>

                  <h3 className="min-h-[54px] text-[18px] font-medium leading-6 tracking-[-0.035em] text-[#211f1b] dark:text-[#f5f5f5]">
                    {request.title}
                  </h3>

                  <div className="mt-5 flex items-end justify-between border-t border-[#eeeae4] pt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-[#aaa39a]">Budget</p>
                      <p className="mt-1 text-[17px] font-semibold tracking-[-0.03em] text-[#211f1b] dark:text-[#f5f5f5]">{request.budget}</p>
                    </div>
                    <div className="text-right">
                      <p className="flex items-center justify-end gap-1 text-[11px] font-semibold text-[#ee642b]">
                        <TrendingUp size={13} /> {request.offers} offers
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-[#aaa39a]">
                        <Clock3 size={11} /> {request.time}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => showToast('Offer Submission', `Viewing offers for "${request.title}"`, 'info')}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-[11px] border border-[#e5dfd7] py-2.5 text-[12px] font-semibold text-[#746f67] transition group-hover:border-[#ee642b] group-hover:text-[#ee642b] focus-visible:ring-2 focus-visible:ring-[#ee642b] outline-none"
                  >
                    View request <TrendingUp size={14} />
                  </button>
                </article>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && items.length === 0 && (
            <div className="rounded-[18px] border border-dashed border-[#dcd6cc] py-16 text-center text-sm text-[#8a847b]">
              <p className="font-semibold text-white/80">No requests match your search.</p>
              <p className="mt-1 text-xs text-white/50">Try searching for other items or be the first to create one!</p>
              <button
                type="button"
                onClick={openComposer}
                className="mt-4 rounded-xl bg-[#ee642b] px-4 py-2 text-xs font-semibold text-white hover:bg-[#d9531e]"
              >
                Create new request
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-[1240px] px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ee642b]">Simple by design</p>
            <h2 className="max-w-[320px] text-4xl font-medium leading-[1] tracking-[-0.06em]">The better way to buy.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="border-t-2 border-[#ee642b] pt-4">
              <span className="text-xs font-semibold text-[#ee642b]">01</span>
              <h3 className="mt-5 text-lg font-semibold">Say what you need</h3>
              <p className="mt-2 text-sm leading-6 text-[#746f67]">Set your budget, add the details, and let verified sellers come to you.</p>
            </div>
            <div className="border-t-2 border-[#d8d2c8] pt-4">
              <span className="text-xs font-semibold text-[#aaa39a]">02</span>
              <h3 className="mt-5 text-lg font-semibold">Compare real offers</h3>
              <p className="mt-2 text-sm leading-6 text-[#746f67]">Sellers compete on price, quality, and speed. You pick the best match.</p>
            </div>
            <div id="safety" className="border-t-2 border-[#d8d2c8] pt-4">
              <span className="text-xs font-semibold text-[#aaa39a]">03</span>
              <h3 className="mt-5 text-lg font-semibold">Deal with confidence</h3>
              <p className="mt-2 text-sm leading-6 text-[#746f67]">Your payment is held safely until the item arrives as promised.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0d0d0d] text-white">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-5 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <a href="#top" className="text-xl font-semibold tracking-[-0.05em]">
              flipside<span className="text-[#ee642b]">.</span>
            </a>
            <p className="mt-2 text-xs text-white/50">Good deals start with a conversation.</p>
          </div>
          <div className="flex gap-6 text-xs text-white/60">
            <a href="#requests" className="hover:text-white transition">Browse requests</a>
            <a href="#how-it-works" className="hover:text-white transition">How it works</a>
            <a href="#safety" className="hover:text-white transition">Safety</a>
          </div>
          <p className="text-[11px] text-white/40">© 2026 Flipside marketplace. All rights reserved.</p>
        </div>
      </footer>

      {/* Accessible Sign-In Modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#0d0d0d]/75 p-5 backdrop-blur-md"
          role="presentation"
          onClick={closeSignIn}
          onKeyDown={(event) => event.key === 'Escape' && closeSignIn()}
        >
          <div
            className="w-full max-w-md rounded-[22px] bg-white p-6 text-[#211f1b] shadow-2xl dark:bg-[#171717] dark:text-white"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sign-in-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ee642b]">Welcome back</p>
                <h2 id="sign-in-title" className="mt-2 text-2xl font-medium tracking-[-0.04em]">
                  Sign in to Flipside
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close sign-in form"
                onClick={closeSignIn}
                className="text-[#746f67] hover:text-[#211f1b] dark:text-white/60 dark:hover:text-white text-xl p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={submitSignIn} className="mt-7">
              <label htmlFor="sign-in-email" className="block text-xs font-semibold text-[#746f67] dark:text-white/70">
                Email
                <input
                  ref={signInEmailRef}
                  id="sign-in-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={signInEmail}
                  onChange={(event) => setSignInEmail(event.target.value)}
                  className="mt-2 h-12 w-full rounded-[12px] border border-[#e4dfd7] bg-[#faf9f7] px-4 text-sm outline-none focus:border-[#ee642b] dark:border-white/10 dark:bg-[#212121] dark:text-white"
                />
              </label>

              <label htmlFor="sign-in-password" className="mt-4 block text-xs font-semibold text-[#746f67] dark:text-white/70">
                Password
                <input
                  id="sign-in-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={signInPassword}
                  onChange={(event) => setSignInPassword(event.target.value)}
                  className="mt-2 h-12 w-full rounded-[12px] border border-[#e4dfd7] bg-[#faf9f7] px-4 text-sm outline-none focus:border-[#ee642b] dark:border-white/10 dark:bg-[#212121] dark:text-white"
                />
              </label>

              {signInError && (
                <p role="alert" className="mt-3 text-xs font-medium text-rose-500">
                  {signInError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSigningIn}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#ee642b] py-3.5 text-sm font-semibold text-white hover:bg-[#d9531e] disabled:opacity-50"
              >
                {isSigningIn && <Loader2 size={16} className="animate-spin" />}
                Sign in
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Accessible Request Composer Modal */}
      {showComposer && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#0d0d0d]/75 p-5 backdrop-blur-md"
          role="presentation"
          onClick={closeComposer}
          onKeyDown={(event) => event.key === 'Escape' && closeComposer()}
        >
          <div
            className="w-full max-w-md rounded-[22px] bg-white p-6 shadow-2xl dark:bg-[#171717] dark:text-white"
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ee642b]">New request</p>
                <h2 id="request-dialog-title" className="mt-2 text-2xl font-medium tracking-[-0.04em]">
                  What do you need?
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close request form"
                onClick={closeComposer}
                className="text-[#746f67] hover:text-[#211f1b] dark:text-white/60 dark:hover:text-white text-xl p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={publishRequest} className="mt-7 space-y-4">
              <div>
                <label htmlFor="request-title" className="block text-xs font-semibold text-[#746f67] dark:text-white/70">
                  Item or service
                </label>
                <input
                  ref={requestTitleRef}
                  id="request-title"
                  value={requestTitle}
                  onChange={(event) => setRequestTitle(event.target.value)}
                  placeholder="e.g. A walnut dining table or MacBook Air"
                  required
                  className="mt-2 h-12 w-full rounded-[12px] border border-[#e4dfd7] bg-[#faf9f7] px-4 text-sm outline-none focus:border-[#ee642b] dark:border-white/10 dark:bg-[#212121] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="request-category" className="block text-xs font-semibold text-[#746f67] dark:text-white/70">
                    Category
                  </label>
                  <select
                    id="request-category"
                    value={requestCategory}
                    onChange={(e) => setRequestCategory(e.target.value)}
                    className="mt-2 h-12 w-full rounded-[12px] border border-[#e4dfd7] bg-[#faf9f7] px-3 text-sm outline-none focus:border-[#ee642b] dark:border-white/10 dark:bg-[#212121] dark:text-white"
                  >
                    {CategoryEnum.options.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="request-location" className="block text-xs font-semibold text-[#746f67] dark:text-white/70">
                    Location
                  </label>
                  <input
                    id="request-location"
                    value={requestLocation}
                    onChange={(e) => setRequestLocation(e.target.value)}
                    placeholder="e.g. Nairobi, KE"
                    className="mt-2 h-12 w-full rounded-[12px] border border-[#e4dfd7] bg-[#faf9f7] px-4 text-sm outline-none focus:border-[#ee642b] dark:border-white/10 dark:bg-[#212121] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="request-budget" className="block text-xs font-semibold text-[#746f67] dark:text-white/70">
                  Target budget
                </label>
                <input
                  id="request-budget"
                  value={requestBudget}
                  onChange={(event) => setRequestBudget(event.target.value)}
                  placeholder="e.g. KES 45,000"
                  required
                  className="mt-2 h-12 w-full rounded-[12px] border border-[#e4dfd7] bg-[#faf9f7] px-4 text-sm outline-none focus:border-[#ee642b] dark:border-white/10 dark:bg-[#212121] dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="request-desc" className="block text-xs font-semibold text-[#746f67] dark:text-white/70">
                  Additional specifications (optional)
                </label>
                <textarea
                  id="request-desc"
                  rows={2}
                  value={requestDesc}
                  onChange={(e) => setRequestDesc(e.target.value)}
                  placeholder="Condition preference, delivery timelines, etc."
                  className="mt-2 w-full rounded-[12px] border border-[#e4dfd7] bg-[#faf9f7] p-3 text-sm outline-none focus:border-[#ee642b] dark:border-white/10 dark:bg-[#212121] dark:text-white"
                />
              </div>

              {formError && (
                <p role="alert" className="text-xs font-medium text-rose-500">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#ee642b] py-3.5 text-sm font-semibold text-white hover:bg-[#d9531e] disabled:opacity-50"
              >
                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                Publish request
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
