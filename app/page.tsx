import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ─── Ambient background ─── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "rgb(var(--bg))" }} />
        {/* Noise grain overlay */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
        {/* Glow blobs */}
        <div
          className="absolute -top-60 -left-60 h-[700px] w-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.13) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute top-20 right-[-200px] h-[600px] w-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute bottom-[-200px] left-[30%] h-[600px] w-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--fg)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--fg)) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <main className="container py-12 sm:py-20">

        {/* ─── Hero ─── */}
        <section className="mx-auto max-w-4xl text-center">

          {/* Status pill */}
          <div className="inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide"
            style={{
              borderColor: "rgba(16,185,129,0.25)",
              background: "rgba(16,185,129,0.06)",
              color: "rgb(var(--muted))",
              backdropFilter: "blur(8px)",
            }}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                style={{ background: "rgb(16,185,129)" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: "rgb(16,185,129)" }} />
            </span>
            Built for students &amp; new grads
          </div>

          {/* Headline */}
          <h1 className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
            <span className="block gradient-text">Make every</span>
            <span className="block gradient-text">application count.</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg leading-relaxed"
            style={{ color: "rgb(var(--muted))" }}>
            Search thousands of jobs, track every stage of your pipeline,
            and{" "}
            <span className="font-semibold" style={{ color: "rgb(var(--fg))" }}>
              optimize your resume with AI.
            </span>
            {" "} All in one place.
          </p>

          {/* CTA row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/jobs"
              className="btn group relative overflow-hidden px-6 py-2.5 text-sm font-semibold">
              <span className="relative z-10 flex items-center gap-2">
                Browse Jobs
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
            <Link href="/resume-match" className="btn-ghost px-6 py-2.5 text-sm font-semibold">
              Resume Match
            </Link>
            <Link href="/dashboard" className="btn-outline px-6 py-2.5 text-sm font-semibold">
              My Dashboard
            </Link>
          </div>

          {/* Social proof micro-line */}
          <p className="mt-5 text-xs" style={{ color: "rgb(var(--muted2))" }}>
            Trusted by{" "}
            <span className="font-semibold" style={{ color: "rgb(var(--muted))" }}>
               students and new grads
            </span>
            {" "}.
          </p>
        </section>

        {/* ─── Feature cards ─── */}
        <section className="mt-16 sm:mt-20">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "rgb(16,185,129)" }}>
              Everything you need
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
              Your job search, supercharged.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">

            {/* Card 1 */}
            <div className="card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ cursor: "default" }}>
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at top left, rgba(16,185,129,0.08) 0%, transparent 60%)",
                }} />
              {/* Icon */}
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.2)",
                }}>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="7" stroke="rgb(16,185,129)" strokeWidth="1.5" />
                  <path d="M7 10l2 2 4-4" stroke="rgb(16,185,129)" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-sm font-bold tracking-tight">Smart Matching</div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                Paste a job description and get an instant match score against your resume, with keyword gaps highlighted.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="badge">Match score</span>
                <span className="badge">Keyword gaps</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ cursor: "default" }}>
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at top left, rgba(59,130,246,0.08) 0%, transparent 60%)",
                }} />
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(59,130,246,0.12)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="5" width="14" height="10" rx="2" stroke="rgb(59,130,246)" strokeWidth="1.5" />
                  <path d="M7 8h6M7 12h4" stroke="rgb(59,130,246)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-sm font-bold tracking-tight">Application Tracker</div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                Kanban-style pipeline so every application has a status. Never lose track of a deadline or follow-up.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="badge">Pipeline view</span>
                <span className="badge">Deadlines</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card group relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ cursor: "default" }}>
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at top left, rgba(168,85,247,0.08) 0%, transparent 60%)",
                }} />
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(168,85,247,0.12)",
                  border: "1px solid rgba(168,85,247,0.2)",
                }}>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z"
                    stroke="rgb(168,85,247)" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-sm font-bold tracking-tight">Dark &amp; Light</div>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                Theme tokens keep your design pixel-perfect in both modes. Accessibility-first contrast ratios throughout.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                
              </div>
            </div>

          </div>
        </section>

        {/* ─── Stats row ─── */}
        <section className="mt-10 sm:mt-14">
          <div className="panel relative overflow-hidden p-6 sm:p-8">
            {/* Background accent */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.04) 0%, transparent 50%, rgba(59,130,246,0.03) 100%)",
              }} />

            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-px"
              style={{ background: "rgb(var(--border))" }}>

              {[
                { value: "2,400+", label: "Active users", sub: "students & new grads", color: "rgb(16,185,129)" },
                { value: "92%", label: "Offer rate", sub: "users who reached offer stage", color: "rgb(59,130,246)" },
                { value: "A+", label: "Accessibility", sub: "WCAG 2.1 AA compliant", color: "rgb(168,85,247)" },
              ].map(({ value, label, sub, color }) => (
                <div key={label}
                  className="flex flex-col gap-1 p-6 sm:p-8"
                  style={{ background: "rgb(var(--bg))" }}>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight"
                    style={{ color }}>
                    {value}
                  </div>
                  <div className="text-sm font-semibold" style={{ color: "rgb(var(--fg))" }}>
                    {label}
                  </div>
                  <div className="text-xs" style={{ color: "rgb(var(--muted))" }}>
                    {sub}
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* ─── How it works ─── */}
        <section className="mt-16 sm:mt-20 mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "rgb(59,130,246)" }}>
              Three steps
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
              From search to offer
            </h2>
          </div>

          <div className="relative space-y-4">
            {/* Vertical connector */}
            <div className="absolute left-6 top-10 bottom-10 w-px hidden sm:block"
              style={{ background: "linear-gradient(to bottom, rgba(16,185,129,0.4), rgba(59,130,246,0.4), rgba(168,85,247,0.4))" }} />

            {[
              {
                step: "01",
                title: "Browse & save jobs",
                desc: "Search thousands of listings filtered for entry-level and internship roles. Save anything interesting in one click.",
                color: "rgb(16,185,129)",
                bg: "rgba(16,185,129,0.1)",
                border: "rgba(16,185,129,0.25)",
                href: "/jobs",
                cta: "Browse Jobs",
              },
              {
                step: "02",
                title: "Match your resume",
                desc: "Upload your resume and paste the job description. Get a score, missing keywords, and tailored suggestions instantly.",
                color: "rgb(59,130,246)",
                bg: "rgba(59,130,246,0.1)",
                border: "rgba(59,130,246,0.25)",
                href: "/resume-match",
                cta: "Try Resume Match",
              },
              {
                step: "03",
                title: "Track your pipeline",
                desc: "Log every application, move cards through stages, and set reminders so nothing falls through the cracks.",
                color: "rgb(168,85,247)",
                bg: "rgba(168,85,247,0.1)",
                border: "rgba(168,85,247,0.25)",
                href: "/dashboard",
                cta: "Open Dashboard",
              },
            ].map(({ step, title, desc, color, bg, border, href, cta }) => (
              <div key={step}
                className="card group flex items-start gap-5 p-5 sm:p-6 transition-all duration-200 hover:-translate-x-0.5">
                {/* Step number circle */}
                <div className="relative shrink-0 flex h-12 w-12 items-center justify-center rounded-full font-black text-sm"
                  style={{ background: bg, border: `1.5px solid ${border}`, color }}>
                  {step}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-bold">{title}</div>
                    <Link href={href}
                      className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 hover:scale-[1.03] shrink-0"
                      style={{
                        background: bg,
                        border: `1px solid ${border}`,
                        color,
                      }}>
                      {cta}
                      <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "rgb(var(--muted))" }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA Banner ─── */}
        <section className="mt-16 sm:mt-20">
          <div className="card relative overflow-hidden p-8 sm:p-12 text-center">
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(16,185,129,0.07) 0%, transparent 65%)",
              }} />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "rgb(16,185,129)" }}>
                Get started free
              </p>
              <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight">
                Land your first offer faster
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm sm:text-base"
                style={{ color: "rgb(var(--muted))" }}>
                Join thousands of students who found their path using JobLedger.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link href="/jobs" className="btn px-7 py-2.5 text-sm font-semibold">
                  Start for free
                </Link>
                <Link href="/resume-match" className="btn-ghost px-7 py-2.5 text-sm font-semibold">
                  Try Resume Match
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="mt-14 border-t pt-8"
          style={{ borderColor: "rgb(var(--border))" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-bold tracking-tight" style={{ color: "rgb(var(--fg))" }}>
              JobLedger
            </div>
            
            <div className="text-xs" style={{ color: "rgb(var(--muted2))" }}>
              © {new Date().getFullYear()} JobLedger. All rights reserved.
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}