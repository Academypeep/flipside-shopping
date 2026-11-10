export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0d0d0d] px-6 text-center text-white">
      <section className="max-w-md">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#ee642b]">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">That page moved.</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">The request you followed is no longer available.</p>
        <a href="/" className="mt-7 inline-flex rounded-full bg-[#ee642b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d95320]">Return to Flipside</a>
      </section>
    </main>
  )
}
