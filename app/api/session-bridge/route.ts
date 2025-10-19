import { NextResponse } from "next/server";
import { getServerSession, type Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { signJwt } from "@/lib/auth";

export async function GET() {
  // make the return type explicit so TS knows it has "user"
  const session: Session | null = await getServerSession(authOptions);

  const email = session?.user?.email;
  const name = session?.user?.name ?? "User";
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  if (!email) {
    return NextResponse.redirect(new URL("/login?error=session", base));
  }

  const token = await signJwt({
    user: {
      id: `google-${Buffer.from(email).toString("hex").slice(0, 12)}`,
      name,
      email,
      savedJobIds: [],
      savedJobs: [],
    },
  });

  const res = NextResponse.redirect(new URL("/dashboard", base));
  res.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
