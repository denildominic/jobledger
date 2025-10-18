import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

export async function GET() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ user: null, savedJobIds: [] });
  try {
    const payload: any = await verifyJwt(token);
    return NextResponse.json({
      user: payload?.user ?? null,
      savedJobIds: payload?.user?.savedJobIds ?? [],
    });
  } catch {
    return NextResponse.json({ user: null, savedJobIds: [] });
  }
}
