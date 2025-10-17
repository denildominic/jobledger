import { getLocalJobById } from "@/lib/jobs";
import { adzunaGetById } from "@/lib/adzu";
import Link from "next/link";
export default async function JobPage({ params }: { params: { id: string } }) {
  const id = Array.isArray(params.id) ? params.id.join("/") : params.id;
  const local = getLocalJobById(id);
  const remote = await adzunaGetById(id);
  const job = local ?? remote;
  if (!job) return <div>Job not found.</div>;
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">{job.title}</h1>
      <div className="opacity-80">
        {job.company} · {job.location}
      </div>
      {job.salary && <div>{job.salary}</div>}
      {job.tags && (
        <div className="flex gap-2 flex-wrap">
          {job.tags.map((t) => (
            <span
              key={t}
              className="text-xs border border-slate-600 px-2 py-1 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <p className="whitespace-pre-wrap leading-7">{job.description}</p>
      <div className="pt-4">
        <Link
          className="btn"
          href={`/resume-match?jobId=${encodeURIComponent(id)}`}
        >
          Match my resume to this job
        </Link>
      </div>
    </main>
  );
}
