import Link from "next/link";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <>

      {/* Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-20"
          style={{ background: "rgba(16,185,129,.35)" }}
        />
        <div
          className="absolute top-10 right-[-140px] h-[460px] w-[460px] rounded-full blur-3xl opacity-15"
          style={{ background: "rgba(59,130,246,.35)" }}
        />
        <div
          className="absolute bottom-[-180px] left-[20%] h-[520px] w-[520px] rounded-full blur-3xl opacity-10"
          style={{ background: "rgba(168,85,247,.35)" }}
        />
      </div>

      <main className="container py-10 sm:py-14">
        {/* Hero */}
        <section className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs"
               style={{
                 borderColor: "rgb(var(--border))",
                 background: "rgba(var(--fg), .03)",
                 color: "rgb(var(--muted))",
               }}>
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: "rgb(16 185 129)" }}
            />
            Job Board for students &amp; new grads
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight">
            <span className="gradient-text">Make every application count</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base" style={{ color: "rgb(var(--muted))" }}>
            Search thousands of jobs, track your applications, and optimize your resume
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/jobs" className="btn">
              Browse Jobs
            </Link>
            <Link href="/resume-match" className="btn-ghost">
              Resume Match
            </Link>
            <Link href="/dashboard" className="btn-outline">
              Dashboard
            </Link>
          </div>
        </section>

        {/* Feature cards */}
        <section className="mt-10 sm:mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5">
              <div className="text-sm font-semibold">Smart matching</div>
              <p className="mt-2 text-sm" style={{ color: "rgb(var(--muted))" }}>
                Compare your resume against a job post and get a clear match score.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge">Match score</span>
                <span className="badge">Keyword coverage</span>
              </div>
            </div>

            <div className="card p-5">
              <div className="text-sm font-semibold">Pro UI</div>
              <p className="mt-2 text-sm" style={{ color: "rgb(var(--muted))" }}>
                Real-world layout with master-detail browsing and fast filtering.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge">Keyboard-friendly</span>
                <span className="badge">Clean spacing</span>
              </div>
            </div>

            <div className="card p-5">
              <div className="text-sm font-semibold">Dark &amp; Light</div>
              <p className="mt-2 text-sm" style={{ color: "rgb(var(--muted))" }}>
                Theme tokens keep your design consistent in both modes.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="badge">Tokenized UI</span>
                <span className="badge">Consistent contrast</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats row */}
        <section className="mt-8 sm:mt-10">
          <div className="panel p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border p-4"
                   style={{ borderColor: "rgb(var(--border))", background: "rgba(var(--fg), .02)" }}>
                <div className="text-2xl font-extrabold">1k+</div>
                <div className="mt-1 text-xs" style={{ color: "rgb(var(--muted))" }}>
                  tracked applications
                </div>
              </div>

              <div className="rounded-xl border p-4"
                   style={{ borderColor: "rgb(var(--border))", background: "rgba(var(--fg), .02)" }}>
                <div className="text-2xl font-extrabold">92%</div>
                <div className="mt-1 text-xs" style={{ color: "rgb(var(--muted))" }}>
                  offer-reach users
                </div>
              </div>

              <div className="rounded-xl border p-4"
                   style={{ borderColor: "rgb(var(--border))", background: "rgba(var(--fg), .02)" }}>
                <div className="text-2xl font-extrabold">A+</div>
                <div className="mt-1 text-xs" style={{ color: "rgb(var(--muted))" }}>
                  accessibility score
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-14 border-t pt-6 text-center text-xs"
                style={{ borderColor: "rgb(var(--border))", color: "rgb(var(--muted2))" }}>
          © {new Date().getFullYear()} JobLedger. All rights reserved.
        </footer>
      </main>
    </>
  );
}
