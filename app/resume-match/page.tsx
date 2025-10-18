// app/resume-match/page.tsx
import { Store } from "@/lib/store";
import ResumeMatchForm from "./resume-match-form";
import type { Job } from "@/lib/jobs";

export default async function ResumeMatchPage({
  searchParams,
}: {
  // Next.js 15: searchParams is a Promise
  searchParams: Promise<{ jobId?: string; jobTitle?: string }>;
}) {
  const { jobId, jobTitle } = await searchParams;

  // Start with explicit jobTitle if present, else default
  let initialJobTitle = jobTitle ?? "Full-Stack Engineer";

  // If jobId is present, try to pull the job title from your store
  if (jobId) {
    const jobs: Job[] = Store.getJobs(); // if this is async, use: const jobs = await Store.getJobs();
    const selected = jobs.find((j) => String(j.id) === String(jobId));
    if (selected?.title) initialJobTitle = selected.title;
  }

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold">Resume Match</h1>
      <p className="opacity-80 mt-2">
        Upload a PDF or paste text and get an instant match score against a job
        description.
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          {/* ✅ pass the resolved title */}
          <ResumeMatchForm initialJobTitle={initialJobTitle} />
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="font-semibold">Tip: Tailor your resume</h3>
          <ul className="list-disc ml-5 mt-2 opacity-80 space-y-1">
            <li>Mirror critical keywords used in the job post.</li>
            <li>Quantify impact with metrics.</li>
            <li>Keep it concise and role-focused.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
