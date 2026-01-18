"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { JobCard } from "@/components/job-card";
import type { Job } from "@/lib/store";
import JobToolbar from "@/components/job-toolbar";
import JobSkeleton from "@/components/job-skeleton";
import EmptyState from "@/components/empty-state";

type ApiJob = any;

// helpers to infer normalized signals
const REMOTE_WORDS = [
  "remote",
  "wfh",
  "work from home",
  "work‐from‐home",
  "home-based",
  "home based",
  "distributed",
  "anywhere",
  "telecommute",
  "telecommuting",
  "virtual",
];
const ONSITE_WORDS = ["onsite", "on-site", "on site", "on-premise", "on premise"];
const HYBRID_WORDS = ["hybrid"];

const INTERN_WORDS = ["intern", "internship", "co-op", "co op", "co-op"];
const NEWGRAD_WORDS = ["new grad", "new-grad", "newgraduate", "entry level", "entry-level"];
const ENTRY_WORDS = ["entry", "junior", "jr."];

function hasAny(hay: string, words: string[]) {
  const s = hay.toLowerCase();
  return words.some((w) => s.includes(w));
}

type Mode = "remote" | "onsite" | "hybrid" | null;
type Level = "intern" | "entry" | "mid" | "senior" | null;

function inferMode(
  j: Partial<Job> & { description?: string; tags?: string[]; type?: string; location?: string; title?: string }
): Mode {
  const blob = [j.title, j.type, j.location, j.description, ...(j.tags ?? [])]
    .filter(Boolean)
    .join(" • ")
    .toLowerCase();

  const isHybrid = hasAny(blob, HYBRID_WORDS);
  const isRemote = hasAny(blob, REMOTE_WORDS);
  const isOnsite = hasAny(blob, ONSITE_WORDS);

  if (isHybrid) return "hybrid";
  if (isRemote && !isOnsite) return "remote";
  if (isOnsite && !isRemote) return "onsite";
  if (j.location && !isRemote) return "onsite";
  return null;
}

function inferLevel(
  j: Partial<Job> & { description?: string; tags?: string[]; type?: string; title?: string }
): Level {
  const blob = [j.title, j.type, j.description, ...(j.tags ?? [])]
    .filter(Boolean)
    .join(" • ")
    .toLowerCase();

  if (hasAny(blob, INTERN_WORDS)) return "intern";
  if (hasAny(blob, NEWGRAD_WORDS) || hasAny(blob, ENTRY_WORDS)) return "entry";
  if (/\b(senior|sr\.|staff|principal|lead)\b/i.test(blob)) return "senior";
  if (/\b(mid|ii|iii)\b/i.test(blob)) return "mid";
  return null;
}

// normalize from API to internal
function normalizeJob(r: ApiJob): Job & { __mode?: Mode; __level?: Level } {
  const j: Job = {
    id: String(r.id ?? r.jobId ?? crypto.randomUUID()),
    title: r.title ?? "",
    company: r.company ?? "Unknown",
    location: r.location ?? "—",
    type: r.type ?? (r.contract_type ? String(r.contract_type).replace(/_/g, " ") : "Full-time"),
    tags: Array.isArray(r.tags) ? r.tags : r.category?.label ? [r.category.label] : [],
    description: r.description ?? r.summary ?? "",
    salary: r.salary ?? "",
    postedAt: r.postedAt ?? r.posted ?? "",
    applyUrl: r.applyUrl ?? r.redirect_url ?? r.url ?? undefined,
  };

  (j as any).__mode = inferMode({ ...j });
  (j as any).__level = inferLevel({ ...j });
  return j as Job & { __mode?: Mode; __level?: Level };
}

type SortKey = "relevant" | "newest" | "salary_high" | "salary_low";

function formatDate(value?: any) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function JobDetailsPanel({ job }: { job: (Job & { __mode?: Mode; __level?: Level }) | null }) {
  if (!job) {
    return (
      <div className="card p-6">
        <div className="text-sm" style={{ color: "rgb(var(--muted))" }}>
          Select a job to see details.
        </div>
      </div>
    );
  }

  const applyHref = (job as any).applyUrl || (job as any).url || (job as any).source || "";
  const meta = [job.location, job.type, (job as any).__mode, (job as any).__level].filter(Boolean);

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-bold leading-tight break-anywhere">{job.title}</h2>
          <p className="mt-1 text-sm break-anywhere" style={{ color: "rgb(var(--muted))" }}>
            {job.company}
          </p>

          {!!meta.length && (
            <div className="mt-3 flex flex-wrap gap-2">
              {meta.map((m) => (
                <span key={String(m)} className="badge">
                  {String(m)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="text-right shrink-0">
          {job.salary ? <div className="text-sm font-semibold break-anywhere">{job.salary}</div> : null}
          {job.postedAt ? (
            <div className="mt-1 text-[11px]" style={{ color: "rgb(var(--muted2))" }}>
              Posted {formatDate(job.postedAt)}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={applyHref || "#"}
          target={applyHref ? "_blank" : undefined}
          rel={applyHref ? "noreferrer noopener" : undefined}
          className="btn"
        >
          Apply
        </a>

        <Link href={`/jobs/${job.id}`} className="btn-ghost">
          View full page
        </Link>

        <Link
          href={`/resume-match?jobId=${encodeURIComponent(String(job.id))}&jobTitle=${encodeURIComponent(job.title)}`}
          className="btn-ghost"
        >
          Resume match
        </Link>
      </div>

      {Array.isArray(job.tags) && job.tags.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {job.tags.slice(0, 12).map((t) => (
            <span key={t} className="badge">
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-6 border-t pt-5" style={{ borderColor: "rgb(var(--border))" }}>
        <h3 className="text-sm font-semibold">Description</h3>
        <p
          className="mt-2 whitespace-pre-line text-sm leading-relaxed break-anywhere"
          style={{ color: "rgb(var(--muted))" }}
        >
          {job.description ? String(job.description).replace(/\s+/g, " ").trim() : "No description available."}
        </p>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<{ level?: Level | "intern"; mode?: Mode }>({});
  const [sort, setSort] = useState<SortKey>("relevant");
  const [jobs, setJobs] = useState<(Job & { __mode?: Mode; __level?: Level })[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function fetchJobs(query: string) {
    setLoading(true);
    const res = await fetch(`/api/jobs/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
    const data = await res.json();
    const normalized = Array.isArray(data) ? data.map(normalizeJob) : [];
    setJobs(normalized);
    setLoading(false);
  }

  useEffect(() => {
    fetchJobs("");
    (async () => {
      const me = await fetch("/api/me", {
        cache: "no-store",
        credentials: "same-origin",
      }).then((r) => r.json());
      setSavedIds(new Set((me?.savedJobIds ?? []).map((x: any) => String(x))));
    })();
  }, []);

  // Debounced API search
  useEffect(() => {
    const id = setTimeout(() => fetchJobs(q), 350);
    return () => clearTimeout(id);
  }, [q]);

  // Salary parser for sorting
  const byNumber = (s: string) => {
    const m = String(s || "").match(/(\$|£|€)?\s*([0-9][0-9,]*)/g);
    if (!m) return 0;
    const nums = m.map((x) => Number(x.replace(/[^\d]/g, "")));
    return Math.max(...nums);
  };

  // Final visible list (filter + sort)
  const visible = useMemo(() => {
    let arr = jobs;

    if (filters.level) arr = arr.filter((j) => (j as any).__level === filters.level);
    if (filters.mode) arr = arr.filter((j) => (j as any).__mode === filters.mode);

    switch (sort) {
      case "salary_high":
        arr = [...arr].sort((a, b) => byNumber(b.salary) - byNumber(a.salary));
        break;
      case "salary_low":
        arr = [...arr].sort((a, b) => byNumber(a.salary) - byNumber(b.salary));
        break;
      case "newest":
        arr = [...arr].sort(
          (a, b) =>
            new Date(b.postedAt || 0).getTime() - new Date(a.postedAt || 0).getTime()
        );
        break;
      default:
        arr = [...arr]; // relevant (API order)
    }

    return arr;
  }, [jobs, filters, sort]);

  // Ensure selection stays valid
  useEffect(() => {
    if (!visible.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !visible.some((j) => String(j.id) === String(selectedId))) {
      setSelectedId(String(visible[0].id));
    }
  }, [visible, selectedId]);

  const selectedJob = useMemo(() => {
    if (!selectedId) return null;
    return visible.find((j) => String(j.id) === String(selectedId)) ?? null;
  }, [visible, selectedId]);

  return (
    <section className="container py-6">
      <div className="sticky top-[64px] z-30 mb-6">
        <JobToolbar
          value={q}
          onChange={setQ}
          sort={sort}
          onSort={setSort}
          filters={filters as any}
          onFilters={setFilters as any}
          results={visible.length}
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <JobSkeleton key={i} />
          ))}
        </div>
      ) : visible.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-6">
          {/* LEFT: list (scrolls) */}
          <div className="space-y-3 lg:h-[calc(100vh-170px)] lg:overflow-y-auto lg:pr-2">
            {visible.map((j) => (
              <JobCard
                key={j.id}
                job={j}
                initiallySaved={savedIds.has(String(j.id))}
                selected={String(j.id) === String(selectedId)}
                onSelect={() => setSelectedId(String(j.id))}
              />
            ))}
          </div>

          {/* RIGHT: detail panel (scrolls) */}
          <aside
            className="hidden lg:block lg:border-l lg:pl-6"
            style={{ borderColor: "rgb(var(--border))" }}
          >
            <div className="sticky top-[148px] lg:h-[calc(100vh-170px)]">
              <div className="h-full overflow-y-auto">
                <JobDetailsPanel job={selectedJob} />
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <EmptyState
          title="No roles match your search"
          subtitle="Try adjusting filters or search terms."
          action={{ href: "/jobs", label: "Clear filters" }}
        />
      )}
    </section>
  );
}
