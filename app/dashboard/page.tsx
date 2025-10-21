import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { Store } from "@/lib/store";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return (
      <section className="container py-10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link href="/login" className="btn">
            Log in
          </Link>
        </div>
        <p className="mt-2 opacity-80">
          Please{" "}
          <Link href="/login" className="underline">
            log in
          </Link>{" "}
          to view your saved jobs.
        </p>
      </section>
    );
  }

  let name = "there";
  let savedIds = new Set<string>();
  try {
    const payload: any = await verifyJwt(token);
    name = payload?.user?.name ?? name;
    savedIds = new Set(
      (payload?.user?.savedJobIds ?? []).map((x: any) => String(x))
    );
  } catch {}

  const jobs = Store.getJobs().filter(
    (j) => j.id && savedIds.has(String(j.id))
  );

  return (
    <section className="container py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Welcome{name ? `, ${name}` : ""}</h1>
        {/* NEW: safe logout */}
        <LogoutButton className="btn-outline" redirectTo="/" />
      </div>

      <p className="opacity-80 mt-2">
        Your saved jobs and applications appear here.
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-5">
        {jobs.map((j) => (
          <div
            key={j.id}
            className="rounded-2xl border p-5 border-slate-200 dark:border-slate-800"
          >
            <h3 className="font-semibold">{j.title}</h3>
            <p className="opacity-80">
              {j.company} • {j.location}
            </p>
            <div className="mt-3 flex gap-2">
              <Link className="btn" href={`/jobs/${j.id}`}>
                Open
              </Link>
              <Link
                className="btn-outline"
                href={`/resume-match?jobId=${j.id}`}
              >
                Match resume
              </Link>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="opacity-70">No saved jobs yet.</div>
        )}
      </div>
    </section>
  );
}
