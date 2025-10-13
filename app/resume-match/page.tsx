import { Store } from "@/lib/store";
import ResumeMatchForm from "./resume-match-form";

export default async function ResumeMatchPage({
  searchParams,
}: {
  searchParams: { jobId?: string };
}) {
  const jobs = Store.getJobs();
  const selected = jobs.find((j) => j.id === searchParams.jobId) || jobs[0];

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold">Resume Match</h1>
      <p className="opacity-80 mt-2">
        Upload a PDF or paste text and get an instant match score against a job
        description.
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <ResumeMatchForm jobs={jobs} initialJobId={selected?.id} />
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
