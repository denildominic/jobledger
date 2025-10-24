// app/api/jobs/search/route.ts
import { NextResponse } from "next/server";
import { Store, type Job } from "@/lib/store";
import { adzunaSearch } from "@/lib/adzu";

// Normalize ANY incoming job shape to our Job shape
function normalizeJob(r: any): Job {
  return {
    id: String(r.id ?? r.jobId ?? crypto.randomUUID()),
    title: r.title ?? "",
    company: r.company ?? r.company_name ?? "Unknown",
    location: r.location?.display_name ?? r.location ?? "—",
    type:
      r.type ??
      (r.contract_type ? String(r.contract_type).replace(/_/g, " ") : "Full-time"),
    tags: Array.isArray(r.tags)
      ? r.tags
      : r.category?.label
      ? [r.category.label]
      : [],
    description: r.description ?? r.summary ?? "",
    salary:
      typeof r.salary_min === "number" && typeof r.salary_max === "number"
        ? `$${Math.round(r.salary_min)}–$${Math.round(r.salary_max)}`
        : r.salary ?? "",
    postedAt: r.postedAt ?? r.posted ?? r.created ?? "",
    // 👇 Make sure Apply is fed correctly
    applyUrl: r.applyUrl ?? r.redirect_url ?? r.url ?? undefined,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  // 1) Local jobs (already normalized in Store.getJobs, but normalize again to be safe)
  let local: Job[] = Store.getJobs().map(normalizeJob);

  // 2) Adzuna results (if keys are set)
  let api: Job[] = [];
  try {
    const hits = await adzunaSearch(q);
    if (Array.isArray(hits)) api = hits.map(normalizeJob);
  } catch {
    // ignore API errors; we still return local
  }

  // 3) Filter local if q present (simple contains)
  let filteredLocal = local;
  if (q) {
    const ql = q.toLowerCase();
    filteredLocal = local.filter(
      (j) =>
        j.title.toLowerCase().includes(ql) ||
        j.company.toLowerCase().includes(ql) ||
        j.location.toLowerCase().includes(ql) ||
        j.tags.some((t) => t.toLowerCase().includes(ql)) ||
        j.description.toLowerCase().includes(ql)
    );
  }

  // 4) Merge (API first so it wins), then de-dupe by id
  const merged = [...api, ...filteredLocal];
  const dedup = Array.from(new Map(merged.map((j) => [String(j.id), j])).values());

  return NextResponse.json(dedup, { headers: { "Cache-Control": "no-store" } });
}
