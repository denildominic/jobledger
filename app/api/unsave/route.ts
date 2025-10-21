export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

function readSavedIdsFromJar(jar: Awaited<ReturnType<typeof cookies>>): string[] {
  const raw = jar.get("savedJobIds")?.value;
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.map((x: any) => String(x)) : [];
  } catch {
    return [];
  }
}

function writeSavedIdsToJar(
  jar: Awaited<ReturnType<typeof cookies>>,
  ids: string[]
) {
  jar.set("savedJobIds", JSON.stringify(ids), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function POST(req: Request) {
  try {
    const jar = await cookies();

    // authorize via NextAuth OR legacy demo token
    const session: any = await getServerSession(authOptions as any);
    const hasNextAuth = Boolean(session?.user?.email);
    const hasLegacyToken = Boolean(jar.get("token")?.value);

    if (!hasNextAuth && !hasLegacyToken) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await req.json().catch(() => ({}));
    if (!jobId) {
      return NextResponse.json({ ok: false, error: "Missing jobId" }, { status: 400 });
    }

    const next = readSavedIdsFromJar(jar).filter((x) => String(x) !== String(jobId));
    writeSavedIdsToJar(jar, next);

    return NextResponse.json({ ok: true, savedJobIds: next });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Internal error" }, { status: 500 });
  }
}
