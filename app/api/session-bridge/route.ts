// app/api/session-bridge/route.ts
import { NextResponse } from "next/server";
import { getServerSession, type Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { signJwt } from "@/lib/auth";

export async function GET(req: Request) {
  const session: Session | null = await getServerSession(authOptions);
  const email = session?.user?.email;
  const name = session?.user?.name ?? "User";
  const { origin } = new URL(req.url);
  const isLocal = origin.startsWith("http://localhost");

  if (!email) return NextResponse.redirect(new URL("/login?error=session", origin));

  const token = await signJwt({
    user: { id: `google-${Buffer.from(email).toString("hex").slice(0,12)}`, name, email, savedJobIds: [], savedJobs: [] },
  });

  const res = NextResponse.redirect(new URL("/dashboard", origin));
  res.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: !isLocal,   // true on Vercel/https, false on localhost
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
