// lib/adzu.ts
import type { Job } from "@/lib/store";


type AdzunaJob = {
  id: string | number;
  title: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  category?: { label?: string };
  salary_min?: number;
  salary_max?: number;
  created?: string;              // ISO date-time created
  description?: string;
  contract_type?: string;        // e.g., "full_time"
  redirect_url?: string;         //  external application URL
};

const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// Normalize Adzuna -> our Job
const map = (j: AdzunaJob): Job => ({
  id: String(j.id),
  title: j.title ?? "",
  company: j.company?.display_name ?? "Unknown",
  location: j.location?.display_name ?? "—",
  type: j.contract_type
    ? j.contract_type.replace(/_/g, "  ").replace(/\b\w/g, (c) => c.toUpperCase())
    : " (Full-time)",
  tags: j.category?.label ? [j.category.label] : [],
  description: j.description ?? "",
  salary:
    typeof j.salary_min === "number" && typeof j.salary_max === "number"
      ? `${usd0.format(j.salary_min)}–${usd0.format(j.salary_max)}`
      : typeof j.salary_min === "number"
      ? `${usd0.format(j.salary_min)}+`
      : "",
  postedAt: j.created ?? "",
  applyUrl: j.redirect_url ?? "",         
});

export async function adzunaSearch(query: string): Promise<Job[] | null> {
  if (!APP_ID || !APP_KEY) return null;

  const url = new URL("https://api.adzuna.com/v1/api/jobs/us/search/1");
  url.searchParams.set("app_id", APP_ID);
  url.searchParams.set("app_key", APP_KEY);
  url.searchParams.set("results_per_page", "100");
  // Return fields that include redirect_url to be safe
  url.searchParams.set("content-type", "application/json");
  if (query) url.searchParams.set("what", query);

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) return null;

  const data: { results?: AdzunaJob[] } = await res.json();
  return (data.results ?? []).map(map);
}

export async function adzunaGetById(id: string): Promise<Job | null> {
  if (!APP_ID || !APP_KEY) return null;
  // Quick narrow: search by quoted id, then exact match
  const list = await adzunaSearch(`"${id}"`);
  return list?.find((j) => String(j.id) === String(id)) ?? null;
}
