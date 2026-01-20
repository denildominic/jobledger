"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function UnsaveJobButton({
  jobId,
  className = "btn-outline",
  children = "Unsave",
}: {
  jobId: string | number;
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function onClick() {
    try {
      setSubmitting(true);
      const res = await fetch("/api/unsave", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Failed to unsave the job.");
    } finally {
      setSubmitting(false);
      startTransition(() => router.refresh()); // reload dashboard list
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={submitting || isPending}
      className={className}
      aria-label="Unsave job"
    >
      {submitting || isPending ? "Unsaving…" : children}
    </button>
  );
}
