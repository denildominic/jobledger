"use client";

import { useState } from "react";
import type { Job } from "@/lib/store";

export default function ResumeMatchForm({
  jobs,
  initialJobId,
}: {
  jobs: Job[];
  initialJobId?: string;
}) {
  const [jobId, setJobId] = useState(initialJobId || jobs[0]?.id);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    overlap: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      if (file) form.append("file", file);
      form.append("text", text);
      form.append("jobId", jobId || "");
      const res = await fetch("/api/resume/match", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm font-medium">Select job</label>
      <select
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
        className="w-full rounded-xl border px-3 py-2 bg-transparent"
      >
        {jobs.map((j) => (
          <option key={j.id} value={j.id}>
            {j.title} — {j.company}
          </option>
        ))}
      </select>

      <div className="grid gap-2">
        <label className="block text-sm font-medium">
          Upload resume (PDF/TXT)
        </label>
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <div className="text-xs opacity-70">Or paste resume text below</div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="w-full rounded-xl border px-3 py-2 bg-transparent"
          placeholder="Paste resume text..."
        />
      </div>

      <button className="btn" disabled={loading}>
        {loading ? "Scoring…" : "Get Match Score"}
      </button>

      {error && <div className="text-red-600 dark:text-red-400">{error}</div>}

      {result && (
        <div className="mt-4 rounded-xl border p-4 border-slate-200 dark:border-slate-800">
          <div className="text-lg font-semibold">
            Match Score: {(result.score * 100).toFixed(1)}%
          </div>
          <div className="mt-2 text-sm opacity-80">
            Top overlapping keywords:
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.overlap.map((k, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-full border border-slate-300 dark:border-slate-700"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
