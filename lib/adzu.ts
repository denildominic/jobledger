import type { Job } from "./jobs";
const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;
const map = (j: any): Job => ({
  id: String(j.id),
  title: j.title,
  company: j.company?.display_name,
  location: j.location?.display_name,
  tags: j.category ? [j.category.label] : [],
  salary:
    j.salary_min && j.salary_max
      ? `$${Math.round(j.salary_min)}–$${Math.round(j.salary_max)}`
      : undefined,
  posted: j.created,
  summary: j.description?.slice(0, 180),
  description: j.description,
});
export async function adzunaSearch(query: string) {
  if (!APP_ID || !APP_KEY) return null;
  const url = new URL(`https://api.adzuna.com/v1/api/jobs/us/search/1`);
  url.searchParams.set("app_id", APP_ID);
  url.searchParams.set("app_key", APP_KEY);
  url.searchParams.set("results_per_page", "20");
  if (query) url.searchParams.set("what", query);
  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.results || []).map(map);
}
export async function adzunaGetById(id: string) {
  if (!APP_ID || !APP_KEY) return null;
  const r = await adzunaSearch(id);
  return r?.find((j) => String(j.id) === String(id)) ?? null;
}
