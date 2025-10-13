import { Store } from "@/lib/store";
import { JobCard } from "@/components/job-card";
import { Suspense } from "react";

export default async function JobsPage() {
  const jobs = Store.getJobs();

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold">Open Roles</h1>
      <p className="opacity-80 mt-2">
        Browse curated opportunities across engineering disciplines.
      </p>
      <div className="mt-6 grid md:grid-cols-2 gap-5">
        <Suspense fallback={<div>Loading...</div>}>
          {jobs.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </Suspense>
      </div>
    </section>
  );
}
