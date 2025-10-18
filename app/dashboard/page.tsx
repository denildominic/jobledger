// app/dashboard/page.tsx
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic"; // important: see cookie changes

export default async function DashboardPage() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return (
      <section className="container py-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
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

  let user: any = null;
  try {
    const payload: any = await verifyJwt(token);
    user = payload?.user ?? null;
  } catch {}

  const savedJobs = (user?.savedJobs ?? []) as Array<{
    id: string;
    title: string;
    company: string;
    location: string;
  }>;

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold">
        Welcome{user?.name ? `, ${user.name}` : ""}
      </h1>
      <p className="opacity-80 mt-2">
        Your saved jobs and applications appear here.
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-5">
        {savedJobs.map((j) => (
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
        {savedJobs.length === 0 && (
          <div className="opacity-70">No saved jobs yet.</div>
        )}
      </div>
    </section>
  );
}
