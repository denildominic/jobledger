import Link from "next/link";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";

import { verifyJwt } from "@/lib/auth";
import { Store } from "@/lib/store";
import type { Job } from "@/lib/store";
import { adzunaGetById } from "@/lib/adzu";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/components/LogoutButton";
import UnsaveJobButton from "@/components/UnsaveJobButton";

async function readSavedIdsFromCookie(): Promise<string[]> {
  const jar = await cookies();
  const raw = jar.get("savedJobIds")?.value;
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.map((x: any) => String(x)) : [];
  } catch {
    return [];
  }
}

async function resolveSavedJobs(savedIds: Set<string>): Promise<Job[]> {
  if (savedIds.size === 0) return [];
  const local = Store.getJobs();
  const idx = new Map(local.map((j) => [String(j.id), j]));
  const out: Job[] = [];

  for (const id of savedIds) {
    const hit = idx.get(id);
    if (hit) {
      out.push(hit);
      continue;
    }
    try {
      const remote = (await adzunaGetById(id)) as Job | null;
      if (remote) out.push(remote);
    } catch {}
  }
  return out;
}

export default async function DashboardPage() {
  let displayName = "there";
  let savedIds = new Set<string>();

  // 1) Legacy JWT
  const token = (await cookies()).get("token")?.value;
  if (token) {
    try {
      const payload: any = await verifyJwt(token);
      displayName = payload?.user?.name ?? displayName;
      savedIds = new Set(
        (payload?.user?.savedJobIds ?? []).map((x: any) => String(x))
      );
    } catch {}
  }

  // 2) NextAuth + cookie
  if (savedIds.size === 0) {
    const session: any = await getServerSession(authOptions as any);
    const nameFromSession =
      (session?.user?.name as string | undefined) ?? displayName;

    if (session?.user?.email) {
      const u = Store.findOrCreateUser({
        name: nameFromSession,
        email: session.user.email,
      });
      displayName = u.name;
      const cookieIds = await readSavedIdsFromCookie();
      savedIds = new Set(cookieIds.map(String));
    }
  }

  // Not logged-in at all
  if (savedIds.size === 0 && displayName === "there") {
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

  const jobs = await resolveSavedJobs(savedIds);

  return (
    <section className="container py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">
          Welcome{displayName ? `, ${displayName}` : ""}
        </h1>
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
              <UnsaveJobButton jobId={String(j.id)} className="btn-outline">
                Unsave
              </UnsaveJobButton>
              {j.applyUrl && (
                <a
                  className="btn-outline"
                  href={j.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply
                </a>
              )}
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
