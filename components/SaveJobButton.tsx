"use client";
import { useState, useTransition } from "react";

export default function SaveJobButton({
  jobId,
  initiallySaved = false,
}: {
  jobId: string;
  initiallySaved?: boolean;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, start] = useTransition();

  async function toggle() {
    start(async () => {
      const res = await fetch(saved ? "/api/unsave" : "/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
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
