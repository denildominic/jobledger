"use client";
import { useEffect, useState } from "react";
import { JobCard } from "@/components/job-card";
import type { Job } from "@/lib/store";

function normalizeJob(r: any): Job {
  return {
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
    // 👇 ensure ApplyButton gets a URL
    applyUrl: r.applyUrl ?? r.redirect_url ?? r.url ?? undefined,
  };
}

export default function JobsPage() {
  const [q, setQ] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  async function load(query: string) {
    setLoading(true);
    const res = await fetch(`/api/jobs/search?q=${encodeURIComponent(query)}`, {
      cache: "no-store",
    });
    const data = await res.json();
    const normalized: Job[] = Array.isArray(data) ? data.map(normalizeJob) : [];
    setJobs(normalized);
    setLoading(false);
  }

  useEffect(() => {
    load("");
    (async () => {
      const me = await fetch("/api/me", {
        cache: "no-store",
        credentials: "same-origin",
      }).then((r) => r.json());
      setSavedIds(new Set((me?.savedJobIds ?? []).map((x: any) => String(x))));
    })();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => load(q), 400);
    return () => clearTimeout(id);
  }, [q]);

  return (
    <section className="container py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Find Jobs</h1>
          <p className="opacity-80 mt-2">
            Search roles by title, tech, company, or keywords.
          </p>
        </div>
        <input
          placeholder="Search e.g. React, Android, Data Engineer"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full md:w-96 rounded-xl border px-3 py-2 bg-transparent"
        />
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-5">
        {loading ? (
          <div>Loading…</div>
        ) : (
          jobs.map((j) => (
            <JobCard
              key={j.id}
              job={j}
              initiallySaved={savedIds.has(String(j.id))}
            />
          ))
        )}
        {!loading && jobs.length === 0 && (
          <div className="opacity-70">No results.</div>
        )}
      </div>
    </section>
  );
}
