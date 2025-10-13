import Link from "next/link";
import type { Job } from "@/lib/store";

export function JobCard({ job }: { job: Job }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <p className="opacity-80">
            {job.company} • {job.location}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {job.tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-1 rounded-full border border-slate-300 dark:border-slate-700"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold">{job.salary}</div>
          <div className="text-xs opacity-70">Posted {job.postedAt}</div>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 opacity-80">{job.description}</p>
      <div className="mt-4 flex gap-2">
        <Link href={`/jobs/${job.id}`} className="btn">
          View
        </Link>
        <Link href={`/resume-match?jobId=${job.id}`} className="btn-outline">
          Match my resume
        </Link>
      </div>
    </div>
  );
}
