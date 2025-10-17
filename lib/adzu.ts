// lib/adzu.ts
import type { Job } from "./jobs";

// Adzuna response shape (minimal fields we use)
type AdzunaJob = {
  id: string | number;
  title: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  category?: { label?: string };
  salary_min?: number;
  salary_max?: number;
  created?: string;
  description?: string;
};

const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const map = (j: AdzunaJob): Job => ({
  id: String(j.id),
  title: j.title,
  company: j.company?.display_name ?? undefined,
  location: j.location?.display_name ?? undefined,
  tags: j.category?.label ? [j.category.label] : [],
  salary:
    typeof j.salary_min === "number" && typeof j.salary_max === "number"
      ? `${usd0.format(j.salary_min)}–${usd0.format(j.salary_max)}`
      : undefined,
  posted: j.created ?? undefined,
  summary: j.description ? j.description.slice(0, 180) : undefined,
  description: j.description ?? "",
});

export async function adzunaSearch(query: string) {
  if (!APP_ID || !APP_KEY) return null;

  const url = new URL("https://api.adzuna.com/v1/api/jobs/us/search/1");
  url.searchParams.set("app_id", APP_ID);
  url.searchParams.set("app_key", APP_KEY);
  url.searchParams.set("results_per_page", "20");
  if (query) url.searchParams.set("what", query);

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) return null;

  const data: { results?: AdzunaJob[] } = await res.json();
  return (data.results ?? []).map(map);
}

export async function adzunaGetById(id: string) {
  if (!APP_ID || !APP_KEY) return null;

  // Narrow search a bit by quoting the id; then match locally by id.
  const list = await adzunaSearch(`"${id}"`);
  return list?.find((j: Job) => String(j.id) === String(id)) ?? null;
}
