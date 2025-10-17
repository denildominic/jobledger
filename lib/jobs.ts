import localJobs from "@/data/jobs.json";
export type Job = {
  id?: string | number;
  jobId?: string | number;
  title: string;
  company?: string;
  location?: string;
  tags?: string[];
  salary?: string;
  posted?: string;
  summary?: string;
  description?: string;
};
const norm = (x: any) => String(x ?? "");
export const listLocalJobs = () => localJobs as Job[];
export const getLocalJobById = (raw: string) =>
  listLocalJobs().find((j) => norm(j.id ?? j.jobId) === norm(raw)) ?? null;
export const searchLocalJobs = (q: string) => {
  const t = q.trim().toLowerCase();
  if (!t) return listLocalJobs();
  return listLocalJobs().filter((j) =>
    [
      j.title,
      j.company,
      j.location,
      j.summary,
      j.description,
      ...(j.tags || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(t)
  );
};
