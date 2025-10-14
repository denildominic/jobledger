"use client";
import { useEffect, useState } from "react";
import { JobCard } from "@/components/job-card";
import type { Job } from "@/lib/store";

export default function JobsPage() {
  const [q, setQ] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  async function load(query: string) {
    setLoading(true);
    const res = await fetch(`/api/jobs/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  }
  useEffect(() => {
    load("");
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
          jobs.map((j) => <JobCard key={j.id} job={j} />)
        )}{" "}
        {!loading && jobs.length === 0 && (
          <div className="opacity-70">No results.</div>
        )}
      </div>
    </section>
  );
}
