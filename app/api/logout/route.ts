export const runtime = "nodejs";

import { NextResponse } from "next/server";

function clearTokenCookie(req: Request) {
  const isSecure = new URL(req.url).protocol === "https:";
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: isSecure,   // true on https (Vercel), false on http (localhost)
    sameSite: "lax",
    path: "/",
    maxAge: 0,          // delete immediately
  });
  return res;
}

export async function POST(req: Request) {
  return clearTokenCookie(req);
}

// (optional) allow GET as well
export async function GET(req: Request) {
  return clearTokenCookie(req);
}
