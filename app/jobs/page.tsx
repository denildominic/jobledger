"use client";

import { useEffect, useMemo, useState } from "react";
import { JobCard } from "@/components/job-card";
import type { Job } from "@/lib/store";
import JobToolbar from "@/components/job-toolbar";
import JobSkeleton from "@/components/job-skeleton";
import EmptyState from "@/components/empty-state";

type ApiJob = any;

// ---------- helpers to infer normalized signals ----------
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
const ONSITE_WORDS = [
  "onsite",
  "on-site",
  "on site",
  "on-premise",
  "on premise",
];
const HYBRID_WORDS = ["hybrid"];

const INTERN_WORDS = ["intern", "internship", "co-op", "co op", "co-op"];
const NEWGRAD_WORDS = [
  "new grad",
  "new-grad",
  "newgraduate",
  "entry level",
  "entry-level",
];
const ENTRY_WORDS = ["entry", "junior", "jr."];

function hasAny(hay: string, words: string[]) {
  const s = hay.toLowerCase();
  return words.some((w) => s.includes(w));
}

type Mode = "remote" | "onsite" | "hybrid" | null;
type Level = "intern" | "entry" | "mid" | "senior" | null;

function inferMode(
  j: Partial<Job> & {
    description?: string;
    tags?: string[];
    type?: string;
    location?: string;
    title?: string;
  }
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
  // Heuristic: if location looks like a city/state and no explicit remote, call it onsite
  if (j.location && !isRemote) return "onsite";
  return null;
}

function inferLevel(
  j: Partial<Job> & {
    description?: string;
    tags?: string[];
    type?: string;
    title?: string;
  }
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

// ---------- normalize from API to internal ----------
function normalizeJob(r: ApiJob): Job & { __mode?: Mode; __level?: Level } {
  const j: Job = {
    id: String(r.id ?? r.jobId ?? crypto.randomUUID()),
    title: r.title ?? "",
    company: r.company ?? "Unknown",
    location: r.location ?? "—",
    type:
      r.type ??
      (r.contract_type
        ? String(r.contract_type).replace(/_/g, " ")
        : "Full-time"),
    tags: Array.isArray(r.tags)
      ? r.tags
      : r.category?.label
      ? [r.category.label]
      : [],
    description: r.description ?? r.summary ?? "",
    salary: r.salary ?? "",
    postedAt: r.postedAt ?? r.posted ?? "",
    applyUrl: r.applyUrl ?? r.redirect_url ?? r.url ?? undefined,
  };

  // attach normalized flags (non-breaking; just extra props)
  (j as any).__mode = inferMode({ ...j });
  (j as any).__level = inferLevel({ ...j });
  return j as Job & { __mode?: Mode; __level?: Level };
}

// ---------- page component ----------
type SortKey = "relevant" | "newest" | "salary_high" | "salary_low";

export default function JobsPage() {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<{
    level?: Level | "intern";
    mode?: Mode;
  }>({});
  const [sort, setSort] = useState<SortKey>("relevant");
  const [jobs, setJobs] = useState<
    (Job & { __mode?: Mode; __level?: Level })[]
  >([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  async function fetchJobs(query: string) {
    setLoading(true);
    const res = await fetch(`/api/jobs/search?q=${encodeURIComponent(query)}`, {
      cache: "no-store",
    });
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

    if (filters.level) {
      arr = arr.filter((j) => (j as any).__level === filters.level);
    }
    if (filters.mode) {
      arr = arr.filter((j) => (j as any).__mode === filters.mode);
    }

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
            new Date(b.postedAt || 0).getTime() -
            new Date(a.postedAt || 0).getTime()
        );
        break;
      default:
        arr = [...arr]; // relevant (API order)
    }

    return arr;
  }, [jobs, filters, sort]);

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
          {Array.from({ length: 6 }).map((_, i) => (
            <JobSkeleton key={i} />
          ))}
        </div>
      ) : visible.length ? (
        <div className="space-y-3">
          {visible.map((j) => (
            <JobCard
              key={j.id}
              job={j}
              initiallySaved={savedIds.has(String(j.id))}
            />
          ))}
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
