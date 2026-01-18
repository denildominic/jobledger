import Link from "next/link";
import type { Job } from "@/lib/store";
import SaveJobButton from "./SaveJobButton";
import ApplyButton from "./ApplyButton";

/** Utility */
function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

/** Fallback letter avatar */
const Logo = ({ company }: { company?: string }) => (
  <div
    className={cx(
      "size-10 sm:size-12 shrink-0 grid place-items-center",
      "rounded-xl border",
      "bg-[rgba(var(--fg),.03)]",
      "text-sm font-semibold"
    )}
    style={{ borderColor: "rgb(var(--border))" }}
    aria-hidden
  >
    {(company ?? "•").trim().charAt(0).toUpperCase()}
  </div>
);

/** Right-side match ring (shows only if job.match is a number) */
function MatchMeter({ value }: { value?: number }) {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const R = 18;
  const C = 2 * Math.PI * R;
  const off = C - (pct / 100) * C;

  const color =
    pct >= 80
      ? "text-emerald-500"
      : pct >= 60
      ? "text-blue-500"
      : pct >= 40
      ? "text-amber-500"
      : "text-rose-500";

  return (
    <div className="hidden sm:block shrink-0 w-[84px]">
      <div className="rounded-xl border p-2 text-center bg-[rgba(var(--fg),.02)]" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="mx-auto relative w-[48px] h-[48px]">
          <svg width="48" height="48" viewBox="0 0 48 48" className="absolute inset-0">
            <circle
              cx="24"
              cy="24"
              r={R}
              stroke="currentColor"
              className="text-slate-200 dark:text-white/10"
              strokeWidth="5"
              fill="none"
            />
            <circle
              cx="24"
              cy="24"
              r={R}
              stroke="currentColor"
              className={color}
              strokeWidth="5"
              fill="none"
              strokeDasharray={C}
              strokeDashoffset={off}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset .6s ease" }}
            />
          </svg>

          <div className="absolute inset-0 grid place-items-center">
            <div className="text-sm font-extrabold leading-none">
              {pct}
              <span className="text-[10px] font-bold opacity-70">%</span>
            </div>
          </div>
        </div>

        <div className="mt-1 text-[10px] uppercase tracking-wide text-[rgb(var(--muted2))]">
          Match
        </div>
      </div>
    </div>
  );
}

function safeDate(value?: any) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function JobCard({
  job,
  initiallySaved = false,
  selected = false,
  onSelect,
}: {
  job: Job & { match?: number };
  initiallySaved?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const applyHref =
    (job as any).applyUrl || (job as any).url || (job as any).source || "";

  return (
    <article
      className={cx("list-card", selected && "list-card-selected")}
      onClick={onSelect}
    >
      {/* left selection accent */}
      <div
        className={cx(
          "absolute left-0 top-0 h-full w-1 rounded-l-xl",
          selected ? "bg-emerald-500" : "bg-transparent"
        )}
        aria-hidden
      />

      <div className="flex gap-4">
        <Logo company={job.company} />

        {/* Middle column */}
        <div className="min-w-0 flex-1">
          {/* Title + salary */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[15px] sm:text-base font-semibold leading-tight truncate break-anywhere">
                {job.title}
              </h3>
              <div className="meta mt-1">
                <span className="truncate font-medium text-[rgb(var(--fg))] opacity-90">
                  {job.company}
                </span>
                {job.location && <span className="truncate">{job.location}</span>}
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
                  <div className="text-[11px] text-[rgb(var(--muted2))]">
                    {safeDate(job.postedAt)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Two-line snippet */}
          {job.description && (
            <p className="mt-3 text-sm text-[rgb(var(--muted))] clamp-2 break-anywhere">
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

          {/* Actions (stop selection change when clicking buttons) */}
          <div
            className="mt-4 flex flex-wrap items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/jobs/${job.id}`} className="btn-ghost">
              View
            </Link>

            <Link
              href={`/resume-match?jobId=${encodeURIComponent(
                String(job.id)
              )}&jobTitle=${encodeURIComponent(job.title)}`}
              className="btn-ghost"
            >
              Resume match
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
