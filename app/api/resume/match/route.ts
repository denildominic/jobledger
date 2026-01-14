// app/api/resume/match/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// Robust loader that works with CJS/ESM shapes under Turbopack
function getPdfParse(): ((buf: Buffer) => Promise<{ text: string }>) | null {
  try {
    const mod = require("pdf-parse");
    const fn = typeof mod === "function" ? mod : (mod?.default ?? null);
    return typeof fn === "function" ? fn : null;
  } catch {
    return null;
  }
}

const pdfParse = getPdfParse();

const STOP = new Set([
  "the","and","a","an","to","of","in","for","on","with","at","as","by","or","is","it",
  "this","that","from","be","are","was","were","you","your","we","our","their","they",
]);

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(w => w && !STOP.has(w));
}

function scoreOverlap(resume: string, title: string) {
  const r = new Set(normalize(resume));
  const k = normalize(title);
  const overlap = k.filter(w => r.has(w));
  const score = k.length ? overlap.length / k.length : 0;
  return { score, overlap: Array.from(new Set(overlap)) };
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const jobTitle = String(form.get("jobTitle") ?? "");
    const text = String(form.get("text") ?? "");
    let resumeText = text;

    const file = form.get("file") as File | null;
    if (file && file.size > 0) {
      const buf = Buffer.from(await file.arrayBuffer());

      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        if (!pdfParse) {
          return NextResponse.json(
            { error: "PDF parsing unavailable in this build; paste text instead." },
            { status: 500 }
          );
        }
        try {
          const parsed = await pdfParse(buf);   // now guaranteed to be a function
          if (parsed?.text) resumeText += "\n" + parsed.text;
        } catch (e: any) {
          return NextResponse.json(
            { error: `PDF parse failed: ${e?.message ?? "unknown error"}` },
            { status: 400 }
          );
        }
      } else {
        resumeText += "\n" + buf.toString("utf8");
      }
    }

    if (!jobTitle.trim() || !resumeText.trim()) {
      return NextResponse.json(
        { error: "Provide a target job title and resume text or file." },
        { status: 400 }
      );
    }

    const { score, overlap } = scoreOverlap(resumeText, jobTitle);
    return NextResponse.json({ score, overlap });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to score resume." }, { status: 500 });
  }
}
