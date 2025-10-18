import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt, signJwt } from "@/lib/auth";
import { Store } from "@/lib/store";

export async function POST(req: Request) {
  const { job } = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let payload: any;
  try {
    payload = await verifyJwt(token);
  } catch {
    const res = NextResponse.json({ error: "Session expired, please log in again." }, { status: 401 });
    // clear the bad cookie
    res.cookies.set({ name: "token", value: "", path: "/", maxAge: 0 });
    return res;
  }

  // ... continue with save logic using payload.user ...
}
