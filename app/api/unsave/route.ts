// app/api/unsave/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt, signJwt } from "@/lib/auth";
import { Store } from "@/lib/store";

export async function POST(req: Request) {
  const { jobId } = await req.json();
  if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 });

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const payload: any = await verifyJwt(token);
  const user = payload.user || {};

  const savedIds = new Set<string>(user.savedJobIds ?? []);
  savedIds.delete(String(jobId));

  const savedJobs = (user.savedJobs ?? []).filter((j: any) => String(j.id) !== String(jobId));

  if (!process.env.VERCEL) {
    Store.removeSavedJob?.(user.id, String(jobId));
  }

  const newToken = await signJwt({ user: { ...user, savedJobIds: [...savedIds], savedJobs } });

  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: "token", value: newToken, httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60*60*24*30 });
  return res;
}
