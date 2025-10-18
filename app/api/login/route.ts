// app/api/login/route.ts
import { NextResponse } from "next/server";
import { signJwt } from "@/lib/auth";
import { Store } from "@/lib/store";

export async function POST(req: Request) {
  const { email, name } = await req.json();
  if (!email || !name) {
    return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
  }

  const user = Store.findOrCreateUser({ name, email });
  const token = await signJwt({ user: { id: user.id, name: user.name, email: user.email } });

  const res = NextResponse.json({ ok: true });
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
