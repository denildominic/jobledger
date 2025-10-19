export const dynamic = "force-dynamic";     // ensure no funky caching
export const runtime = "nodejs";            // use Node (jose works fine here)

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt, signJwt } from "@/lib/auth";
import { Store } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ error: "jobId required" }, { status: 400 });
    }

    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let payload: any;
    try {
      payload = await verifyJwt(token);
    } catch {
      return NextResponse.json({ error: "Invalid/expired session" }, { status: 401 });
    }

    const user = payload?.user ?? {};
    const saved = new Set<string>(user.savedJobIds ?? []);
    saved.add(String(jobId));

    // dev-only persistence; no-op on Vercel
    try { Store.addSavedJob(user.id, String(jobId)); } catch {}

    const newToken = await signJwt({ user: { ...user, savedJobIds: [...saved] } });

    const res = NextResponse.json({ ok: true, savedJobIds: [...saved] });
    res.cookies.set({
      name: "token",
      value: newToken,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Save failed" }, { status: 500 });
  }
}
