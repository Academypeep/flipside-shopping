'use client'

import { useMemo, useState } from 'react'
import {
  ArrowUpRight,
  Bell,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  Filter,
  LayoutGrid,
  ListFilter,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Sparkles,
  SunMedium,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react'

const wants = [
  { id: '01', title: 'Industrial pendant lights', buyer: 'Noah Williams', category: 'Home & living', budget: '$420–$680', offers: 8, freshness: '12 min ago', status: 'Hot', color: 'from-amber-400/25 to-orange-500/5', initials: 'NW' },
  { id: '02', title: 'Vintage film camera', buyer: 'Maya Chen', category: 'Electronics', budget: '$180–$260', offers: 5, freshness: '34 min ago', status: 'Open', color: 'from-cyan-400/20 to-blue-500/5', initials: 'MC' },
  { id: '03', title: 'Oak writing desk', buyer: 'Theo Brooks', category: 'Furniture', budget: '$600–$950', offers: 11, freshness: '1 hr ago', status: 'Hot', color: 'from-emerald-400/20 to-teal-500/5', initials: 'TB' },
  { id: '04', title: 'Set of ceramic planters', buyer: 'Aria Patel', category: 'Home & living', budget: '$90–$140', offers: 3, freshness: '2 hrs ago', status: 'Open', color: 'from-rose-400/20 to-pink-500/5', initials: 'AP' },
]

const activity = [
  { icon: Sparkles, tone: 'text-amber-300 bg-amber-300/10', text: 'Your offer on Oak writing desk was viewed', time: '8m' },
  { icon: MessageSquareText, tone: 'text-cyan-300 bg-cyan-300/10', text: 'Maya sent a message about the camera', time: '24m' },
  { icon: TrendingUp, tone: 'text-emerald-300 bg-emerald-300/10', text: 'You are trending in Electronics', time: '1h' },
]

export default function FlipsideDashboard() {
  const [activeTab, setActiveTab] = useState('Discover')
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [saved, setSaved] = useState<string[]>([])
  const [showComposer, setShowComposer] = useState(false)

  const filteredWants = useMemo(() => wants.filter((want) => want.title.toLowerCase().includes(query.toLowerCase()) || want.category.toLowerCase().includes(query.toLowerCase())), [query])

  return (
    <main className="min-h-screen bg-[#080b0f] text-slate-100 selection:bg-cyan-300/30">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="aurora aurora-one" />
        <div className="aurora aurora-two" />
        <div className="grain" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1560px]">
        <aside className={`fixed inset-y-0 left-0 z-30 flex w-[248px] flex-col border-r border-white/[0.07] bg-[#0b0f14]/95 px-5 py-6 backdrop-blur-2xl transition-transform duration-300 lg:relative lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-10 flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <span className="brand-mark"><span /></span>
              <span className="text-[19px] font-semibold tracking-[-0.04em]">Flipside</span>
            </div>
            <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-slate-500 hover:bg-white/5 hover:text-white lg:hidden"><X /></button>
          </div>

          <div className="mb-7 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">Workspace</div>
          <nav className="flex flex-col gap-1">
            {['Discover', 'My wants', 'My offers', 'Messages'].map((item, index) => (
              <button key={item} onClick={() => setActiveTab(item)} className={`nav-item ${activeTab === item ? 'nav-item-active' : ''}`}>
                {index === 0 ? <LayoutGrid /> : index === 1 ? <Zap /> : index === 2 ? <ArrowUpRight /> : <MessageSquareText />}
                <span>{item}</span>
                {item === 'Messages' && <span className="ml-auto rounded-full bg-cyan-300 px-1.5 py-0.5 text-[10px] font-bold text-[#061014]">3</span>}
              </button>
            ))}
          </nav>

          <div className="mb-3 mt-10 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">Manage</div>
          <nav className="flex flex-col gap-1">
            <button className="nav-item"><Users /><span>People</span></button>
            <button className="nav-item"><Settings2 /><span>Settings</span></button>
          </nav>

          <div className="mt-auto rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/[0.09] to-transparent p-4">
            <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-cyan-300/15 text-cyan-200"><Sparkles /></div>
            <p className="text-sm font-medium">Make the first move.</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Post what you need and let the right offer find you.</p>
            <button onClick={() => setShowComposer(true)} className="press mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-3 py-2 text-xs font-bold text-[#071014] hover:bg-cyan-200"><Plus /> Post a want</button>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-white/[0.07] bg-[#080b0f]/80 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
            <button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="mr-3 rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden"><Menu /></button>
            <div className="relative hidden max-w-[360px] flex-1 md:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search wants, categories, people" className="h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-10 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 focus:bg-white/[0.06]" /><kbd className="absolute right-2 top-2 rounded-md border border-white/10 px-1.5 py-1 text-[10px] text-slate-600"><Command /></kbd></div>
            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              <button aria-label="Toggle theme" className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-200"><SunMedium /></button>
              <button aria-label="Notifications" className="relative rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-200"><Bell /><i className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-coral-300" /></button>
              <span className="hidden h-6 w-px bg-white/10 sm:block" />
              <button className="flex items-center gap-2 rounded-xl p-1.5 pr-2 transition hover:bg-white/5"><span className="avatar">JD</span><span className="hidden text-sm font-medium sm:block">Jordan Diaz</span><ChevronDown className="size-4 text-slate-600" /></button>
            </div>
          </header>

          <div className="mx-auto max-w-[1220px] px-5 py-8 sm:px-8 lg:px-10 lg:py-11">
            <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div className="stagger-in"><p className="mb-3 flex items-center gap-2 text-xs font-medium text-cyan-200"><span className="live-dot" /> Live marketplace</p><h1 className="text-3xl font-semibold tracking-[-0.05em] text-white sm:text-[42px]">Good morning, Jordan<span className="text-cyan-300">.</span></h1><p className="mt-2 text-sm text-slate-500">A smarter way to find what&apos;s next.</p></div>
              <button onClick={() => setShowComposer(true)} className="press group flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-[#071014] shadow-[0_0_28px_rgba(103,232,249,0.12)] transition hover:bg-cyan-200"><Plus className="transition group-hover:rotate-90" /> Post a want</button>
            </div>

            <div className="mb-9 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[['Active wants', '24', '+18%', 'text-cyan-200'], ['Offers received', '68', '+12%', 'text-emerald-300'], ['Avg. response', '2.4h', '-36%', 'text-amber-200'], ['Match rate', '82%', '+9%', 'text-violet-300']].map(([label, value, change, color]) => <div key={label} className="stat-card"><div className="flex items-center justify-between"><span className="text-xs text-slate-500">{label}</span><TrendingUp className={`size-3.5 ${color}`} /></div><div className="mt-3 flex items-end gap-2"><strong className="text-2xl font-semibold tracking-[-0.05em] text-white">{value}</strong><span className={`mb-1 text-[11px] font-semibold ${color}`}>{change}</span></div><div className="sparkline"><span /><span /><span /><span /><span /><span /><span /></div></div>)}
            </div>

            <div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-semibold tracking-[-0.03em] text-white">Find your next win</h2><p className="mt-1 text-xs text-slate-500">Fresh wants from people ready to buy.</p></div><div className="flex gap-2"><button className="icon-button"><ListFilter /></button><button className="icon-button hidden sm:flex"><Filter /><span className="ml-1 text-xs">Filters</span></button></div></div>
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1">{['All wants', 'Near you', 'Ending soon', 'Best match'].map((filter, index) => <button key={filter} className={`chip ${index === 0 ? 'chip-active' : ''}`}>{filter}</button>)}</div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
              <div className="grid gap-3 sm:grid-cols-2">{filteredWants.map((want) => <article key={want.id} className="want-card group"><div className={`relative h-[104px] overflow-hidden rounded-t-2xl bg-gradient-to-br ${want.color}`}><div className="absolute -right-4 -top-8 size-32 rounded-full border border-white/10 bg-white/[0.035] blur-[1px]" /><span className="absolute left-4 top-4 rounded-md border border-white/10 bg-black/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">{want.status}</span><button onClick={() => setSaved((current) => current.includes(want.id) ? current.filter((id) => id !== want.id) : [...current, want.id])} aria-label="Save want" className={`absolute right-3 top-3 rounded-lg p-2 transition ${saved.includes(want.id) ? 'bg-cyan-300 text-[#071014]' : 'bg-black/15 text-white/60 hover:bg-black/30 hover:text-white'}`}><Zap className={saved.includes(want.id) ? 'fill-current' : ''} /></button><span className="absolute bottom-3 left-4 text-[11px] font-medium text-white/60">{want.category}</span></div><div className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold tracking-[-0.02em] text-white transition group-hover:text-cyan-200">{want.title}</h3><p className="mt-1 text-xs text-slate-500">{want.budget} · {want.offers} offers</p></div><span className="avatar avatar-small">{want.initials}</span></div><div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3"><span className="flex items-center gap-1.5 text-[11px] text-slate-600"><Clock3 className="size-3.5" /> {want.freshness}</span><button className="text-xs font-semibold text-cyan-200 opacity-0 transition group-hover:opacity-100">Make offer <ArrowUpRight className="ml-1 inline size-3" /></button></div></div></article>)}</div>

              <aside className="space-y-4"><div className="panel"><div className="mb-5 flex items-center justify-between"><div><h3 className="font-semibold tracking-[-0.02em] text-white">Your pulse</h3><p className="mt-1 text-xs text-slate-500">Last 7 days</p></div><button className="text-slate-600 hover:text-white"><MoreHorizontal /></button></div><div className="flex items-end gap-3"><strong className="text-4xl font-semibold tracking-[-0.07em] text-white">$2,840</strong><span className="mb-2 text-xs font-semibold text-emerald-300">+24.8%</span></div><div className="activity-chart mt-5"><div className="chart-line" /><div className="chart-fill" />{[1,2,3,4,5,6,7].map((day) => <span key={day} />)}</div><div className="mt-3 flex justify-between text-[10px] text-slate-700"><span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span></div></div><div className="panel"><div className="mb-5 flex items-center justify-between"><h3 className="font-semibold tracking-[-0.02em] text-white">Recent activity</h3><button className="text-xs font-medium text-cyan-200 hover:text-cyan-100">View all</button></div><div className="flex flex-col gap-4">{activity.map(({ icon: Icon, tone, text, time }) => <div className="flex gap-3" key={text}><div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${tone}`}><Icon className="size-4" /></div><div className="min-w-0"><p className="text-xs leading-5 text-slate-300">{text}</p><span className="text-[10px] text-slate-600">{time} ago</span></div></div>)}</div></div></aside>
            </div>
          </div>
        </section>
      </div>

      {showComposer && <div className="modal-backdrop" onClick={() => setShowComposer(false)}><div className="composer" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">New request</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">What are you looking for?</h2><p className="mt-2 text-sm text-slate-500">The right seller might already have it.</p></div><button aria-label="Close" onClick={() => setShowComposer(false)} className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white"><X /></button></div><label className="mt-7 block text-xs font-medium text-slate-400">Item or service<input autoFocus placeholder="e.g. A walnut dining table" className="control mt-2" /></label><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-xs font-medium text-slate-400">Budget<input placeholder="$ 0.00" className="control mt-2" /></label><label className="text-xs font-medium text-slate-400">Category<select className="control mt-2"><option>Home & living</option><option>Electronics</option><option>Furniture</option></select></label></div><button onClick={() => setShowComposer(false)} className="press mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 py-3 text-sm font-bold text-[#071014] hover:bg-cyan-200">Publish want <ArrowUpRight /></button></div></div>}
    </main>
  )
}
