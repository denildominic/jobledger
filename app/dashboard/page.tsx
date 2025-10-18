import { cookies } from "next/headers";
import Link from "next/link";
import { Store } from "@/lib/store";
import { verifyJwt } from "@/lib/auth";

export default async function DashboardPage() {
  // In your Next version, cookies() returns a Promise
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

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

  let userId: string | null = null;
  try {
    const payload: any = await verifyJwt(token);
    userId = (payload?.user?.id as string) ?? null;
  } catch {}

  const users = Store.getUsers();
  const user = users.find((u) => u.id === userId) ?? null;

  const saved = new Set(user?.savedJobIds ?? []);
  const jobs = Store.getJobs().filter((j) => j.id && saved.has(j.id!));

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold">
        Welcome{user?.name ? `, ${user.name}` : ""}
      </h1>
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
