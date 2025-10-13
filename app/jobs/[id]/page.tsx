import { Store } from "@/lib/store";
import Link from "next/link";

export default async function JobDetail({
  params,
}: {
  params: { id: string };
}) {
  const job = Store.getJobs().find((j) => j.id === params.id);
  if (!job) return <div className="container py-10">Job not found.</div>;

  return (
    <section className="container py-10">
      <Link href="/jobs" className="text-sm opacity-70 hover:opacity-100">
        ← Back to jobs
      </Link>
      <h1 className="mt-2 text-3xl font-bold">{job.title}</h1>
      <p className="opacity-80">
        {job.company} • {job.location} • {job.type}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {job.tags.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-1 rounded-full border border-slate-300 dark:border-slate-700"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="prose dark:prose-invert mt-6 max-w-none">
        <p>{job.description}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href={`/resume-match?jobId=${job.id}`} className="btn">
          Match my resume
        </Link>
        <Link href="/dashboard" className="btn-outline">
          Save to Dashboard
        </Link>
      </div>
    </section>
  );
}
