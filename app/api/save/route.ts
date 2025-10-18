import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt, signJwt } from "@/lib/auth";
import { Store } from "@/lib/store";

export async function POST(req: Request) {
  const { jobId } = await req.json();
  if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 });

  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const payload: any = await verifyJwt(token);
  const user = payload?.user ?? {};
  const saved = new Set<string>(user.savedJobIds ?? []);
  saved.add(String(jobId));

  // persist locally; no-op on Vercel
  Store.addSavedJob(user.id, String(jobId));

  const newToken = await signJwt({ user: { ...user, savedJobIds: [...saved] } });
  const res = NextResponse.json({ ok: true, savedJobIds: [...saved] });
  res.cookies.set({ name: "token", value: newToken, httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
