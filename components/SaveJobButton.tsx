// components/SaveJobButton.tsx
"use client";
import { useState, useTransition } from "react";

type SavedJob = {
  id: string;
  title: string;
  company: string;
  location: string;
};

export default function SaveJobButton({
  job,
  initiallySaved,
}: {
  job: SavedJob;
  initiallySaved: boolean;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, start] = useTransition();

  function toggle() {
    start(async () => {
      const res = await fetch(saved ? "/api/unsave" : "/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saved ? { jobId: job.id } : { job }),
      });
      if (res.ok) setSaved(!saved);
    });
  }

  return (
    <button
      className={saved ? "btn-outline" : "btn"}
      disabled={pending}
      onClick={toggle}
      aria-pressed={saved}
    >
      {pending ? "Saving..." : saved ? "Unsave" : "Save"}
    </button>
  );
}
