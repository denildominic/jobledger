import Link from "next/link";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>
      {/* Decorative background blobs (no interactivity, pure CSS) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-24 size-[38rem] rounded-full blur-3xl opacity-20 bg-brand/40" />
        <div className="absolute top-10 right-[-10rem] size-[30rem] rounded-full blur-3xl opacity-15 bg-indigo-500/40" />
      </div>

      <section className="relative overflow-hidden">
        <div className="container pt-16 pb-24 text-center">
          {/* Badge */}
          <div className="badge mx-auto">
            <span className="h-2 w-2 rounded-full bg-brand inline-block" />
            <span>AI-assisted matching • private &amp; local</span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08]">
            Find work you <span className="gradient-text">actually want</span>
          </h1>

          {/* Subhead */}
          <p className="mt-4 text-lg opacity-80 max-w-2xl mx-auto">
            Search roles, analyze your resume against job descriptions, and
            track applications, all in one place.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/jobs" className="btn-primary shadow-glow">
              Browse Jobs
            </Link>
            <Link href="/resume-match" className="btn-ghost">
              Resume Match
            </Link>
          </div>

          {/* Feature cards */}
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Smart Matching",
                desc: "Upload your resume to see how well it aligns with any job.",
              },
              {
                title: "Pro UI",
                desc: "A polished, accessible interface trusted by teams.",
              },
              {
                title: "Dark & Light",
                desc: "Automatic theme with a manual toggle.",
              },
            ].map((c, i) => (
              <article key={i} className="card p-6 text-left">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {c.desc}
                </p>
              </article>
            ))}
          </div>

          {/* Mini teaser / metrics row (optional, looks premium) */}
          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {[
              { k: "1k+", v: "tracked applications" },
              { k: "92%", v: "offer-reach users" },
              { k: "A+", v: "accessibility score" },
            ].map((m, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 px-4 py-3 text-sm"
              >
                <div className="font-bold text-xl">{m.k}</div>
                <div className="opacity-70">{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
