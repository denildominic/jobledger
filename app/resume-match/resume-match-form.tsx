"use client";
import { useEffect, useRef, useState } from "react";

type Props = { initialJobTitle?: string };

export default function ResumeMatchForm({
  initialJobTitle = "Full-Stack Engineer",
}: Props) {
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    overlap: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<number | null>(null);

  async function compute() {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      if (file) form.append("file", file);
      form.append("text", text);
      form.append("jobTitle", jobTitle);
      const res = await fetch("/api/resume/match", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (ref.current) window.clearTimeout(ref.current);
    ref.current = window.setTimeout(() => {
      if (jobTitle.trim() || text.trim() || file) compute();
    }, 600);
  }, [jobTitle, text, file]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        compute();
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">
          Target job title
        </label>
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          placeholder="e.g., Android Engineer, Data Engineer, Frontend Engineer"
        />
      </div>

      <div className="grid gap-2">
        <label className="block text-sm font-medium">
          Upload resume (PDF/TXT)
        </label>
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm"
        />
        <div className="text-xs opacity-70">Or paste resume text below</div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          placeholder="Paste resume text..."
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center rounded-xl px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Scoring…" : "Get Match Score"}
      </button>

      {error && <div className="text-red-600 dark:text-red-400">{error}</div>}

      {result && (
        <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
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
