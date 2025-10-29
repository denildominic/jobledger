"use client";

import { useId } from "react";

type SortKey = "relevant" | "newest" | "salary_high" | "salary_low";

export default function JobToolbar({
  value,
  onChange,
  sort,
  onSort,
  filters,
  onFilters,
  results,
}: {
  value: string;
  onChange: (v: string) => void;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  filters: { level?: string; mode?: string };
  onFilters: (f: { level?: string; mode?: string }) => void;
  results: number;
}) {
  const searchId = useId();
  return (
    <div className="card border border-white/10 bg-white/5 px-3 sm:px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <label htmlFor={searchId} className="sr-only">
          Search jobs
        </label>
        <input
          id={searchId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search title, tech, or company…"
          className="input sm:max-w-sm"
        />

        {/* Quick filters */}
        <div className="flex flex-wrap items-center gap-2 sm:ml-3">
          <button
            className={`badge ${
              filters.mode === "remote" ? "bg-brand/20 border-brand/40" : ""
            }`}
            onClick={() =>
              onFilters({
                ...filters,
                mode: filters.mode === "remote" ? undefined : "remote",
              })
            }
          >
            Remote
          </button>
          <button
            className={`badge ${
              filters.mode === "onsite" ? "bg-brand/20 border-brand/40" : ""
            }`}
            onClick={() =>
              onFilters({
                ...filters,
                mode: filters.mode === "onsite" ? undefined : "onsite",
              })
            }
          >
            Onsite
          </button>
          <button
            className={`badge ${
              filters.mode === "hybrid" ? "bg-brand/20 border-brand/40" : ""
            }`}
            onClick={() =>
              onFilters({
                ...filters,
                mode: filters.mode === "hybrid" ? undefined : "hybrid",
              })
            }
          >
            Hybrid
          </button>

          <div className="hidden sm:block h-6 w-px bg-white/10 mx-1" />

          <button
            className={`badge ${
              filters.level === "intern" ? "bg-brand/20 border-brand/40" : ""
            }`}
            onClick={() =>
              onFilters({
                ...filters,
                level: filters.level === "intern" ? undefined : "intern",
              })
            }
          >
            Intern/New Grad
          </button>
          <button
            className={`badge ${
              filters.level === "entry" ? "bg-brand/20 border-brand/40" : ""
            }`}
            onClick={() =>
              onFilters({
                ...filters,
                level: filters.level === "entry" ? undefined : "entry",
              })
            }
          >
            Entry
          </button>
        </div>

        {/* Sort + result count */}
        <div className="sm:ml-auto flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as SortKey)}
            className="select"
            aria-label="Sort"
          >
            <option value="relevant">Relevant</option>
            <option value="newest">Newest</option>
            <option value="salary_high">Salary: High → Low</option>
            <option value="salary_low">Salary: Low → High</option>
          </select>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {results} results
          </span>
        </div>
      </div>
    </div>
  );
}
