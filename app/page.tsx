import Link from "next/link";

export default function Home() {
  return (
    <section className="relative overflow-hidden">
      <div className="container py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm border-slate-300 dark:border-slate-700">
          <span className="h-2 w-2 rounded-full bg-brand inline-block" />
          AI‑assisted matching, private & local
        </div>
        <h1 className="mt-6 text-5xl md:text-6xl font-extrabold tracking-tight">
          Find work you <span className="text-brand">actually want</span>
        </h1>
        <p className="mt-4 text-lg opacity-80">
          Search roles, analyze your resume against job descriptions, and track
          applications — all in one place.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/jobs" className="btn shadow-glow">
            Browse Jobs
          </Link>
          <Link href="/resume-match" className="btn-outline">
            Resume Match
          </Link>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-6">
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
              desc: "Automatic theme with manual toggle.",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="rounded-2xl border p-6 text-left shadow-sm border-slate-200 dark:border-slate-800"
            >
              <h3 className="text-xl font-semibold">{c.title}</h3>
              <p className="mt-2 opacity-80">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
