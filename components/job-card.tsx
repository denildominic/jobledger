import Link from "next/link";
import type { Job } from "@/lib/store";
import SaveJobButton from "./SaveJobButton";
import ApplyButton from "./ApplyButton";

/** Fallback letter avatar */
const Logo = ({ company }: { company?: string }) => (
  <div className="size-10 sm:size-12 shrink-0 rounded-xl bg-white/10 grid place-items-center text-sm font-semibold">
    {(company ?? "•").trim().charAt(0).toUpperCase()}
  </div>
);

/** Right-side match ring (shows only if job.match is a number) */
function MatchMeter({ value }: { value?: number }) {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const R = 22;
  const C = 2 * Math.PI * R;
  const off = C - (pct / 100) * C;

  return (
    <div className="hidden sm:block shrink-0 w-[86px] text-center">
      <svg width="86" height="86" viewBox="0 0 86 86" className="mx-auto">
        <circle
          cx="43"
          cy="43"
          r={R}
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="43"
          cy="43"
          r={R}
          stroke="currentColor"
          className="text-brand"
          strokeWidth="8"
          fill="none"
          strokeDasharray={C}
          strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .6s ease" }}
        />
      </svg>
      <div className="mt-[-58px] text-xl font-extrabold select-none">
        {pct}%
      </div>
      <div className="mt-1 text-[10px] opacity-70 uppercase tracking-wide">
        Match
      </div>
    </div>
  );
}

export function JobCard({
  job,
  initiallySaved = false,
}: {
  job: Job & { match?: number };
  initiallySaved?: boolean;
}) {
  const applyHref =
    (job as any).applyUrl || (job as any).url || (job as any).source || "";

  return (
    <article className="list-card">
      <div className="flex gap-4">
        <Logo company={job.company} />

        {/* Middle column */}
        <div className="min-w-0 flex-1">
          {/* Title + salary */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold leading-tight truncate break-anywhere">
                {job.title}
              </h3>
              <div className="meta mt-1">
                <span className="truncate">{job.company}</span>
                {job.location && (
                  <span className="truncate">{job.location}</span>
                )}
                {job.type && <span className="truncate">{job.type}</span>}
              </div>
            </div>
            {(job.salary || job.postedAt) && (
              <div className="text-right shrink-0">
                {job.salary && (
                  <div className="text-sm font-semibold break-anywhere">
                    {job.salary}
                  </div>
                )}
                {job.postedAt && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {new Date(job.postedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Two-line snippet */}
          {job.description && (
            <p className="mt-3 text-sm text-slate-400 clamp-2 break-anywhere">
              {String(job.description).replace(/\s+/g, " ").trim()}
            </p>
          )}

          {/* Tags */}
          {Array.isArray(job.tags) && job.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {job.tags.slice(0, 6).map((t) => (
                <span key={t} className="badge">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              href={`/jobs/${job.id}`}
              className="btn-ghost text-sm px-3 py-2"
            >
              View
            </Link>
            <Link
              href={`/resume-match?jobId=${encodeURIComponent(
                String(job.id)
              )}&jobTitle=${encodeURIComponent(job.title)}`}
              className="btn-ghost text-sm px-3 py-2"
            >
              Match my resume
            </Link>
            <ApplyButton href={applyHref} />
            <SaveJobButton
              jobId={String(job.id)}
              initiallySaved={initiallySaved}
            />
          </div>
        </div>

        {/* Right column */}
        <MatchMeter value={(job as any).match} />
      </div>
    </article>
  );
}
