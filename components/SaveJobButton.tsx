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
  const [err, setErr] = useState<string | null>(null);

  async function call(path: "/api/save" | "/api/unsave") {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // include same-origin cookies (default in browsers, but explicit is fine)
      credentials: "same-origin",
      body: JSON.stringify({ jobId }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j?.error || `HTTP ${res.status}`);
    }
  }

  function toggle() {
    setErr(null);
    // optimistic UI
    const next = !saved;
    setSaved(next);
    start(async () => {
      try {
        await call(next ? "/api/save" : "/api/unsave");
      } catch (e: any) {
        // revert on failure
        setSaved(!next);
        setErr(e?.message ?? "Failed");
        console.error("Save error:", e);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        className={saved ? "btn-outline" : "btn"}
        disabled={pending}
        onClick={toggle}
        aria-pressed={saved}
      >
        {pending ? "Saving..." : saved ? "Saved" : "Save"}
      </button>
      {err && <span className="text-red-500 text-xs">{err}</span>}
    </div>
  );
}
