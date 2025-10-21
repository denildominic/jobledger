import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { Store } from "@/lib/store";
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

export async function GET() {
  const jar = await cookies();

  // Legacy JWT path (demo login)
  const token = jar.get("token")?.value;
  if (token) {
    try {
      const payload: any = await verifyJwt(token);
      return NextResponse.json({
        user: payload?.user ?? null,
        savedJobIds: payload?.user?.savedJobIds ?? [],
      });
    } catch {
      // fall through to NextAuth
    }
  }

  // NextAuth (Google) path
  try {
    const session: any = await getServerSession(authOptions as any);
    const email = session?.user?.email as string | undefined;
    const name = (session?.user?.name as string | undefined) || "User";

    if (!email) return NextResponse.json({ user: null, savedJobIds: [] });

    // Ensure a user record exists locally (just for name/email display)
    const u = Store.findOrCreateUser({ name, email });

    // Saved ids from the cookie
    const savedJobIds = readSavedIdsFromJar(jar);

    return NextResponse.json({
      user: { id: u.id, name: u.name, email: u.email },
      savedJobIds,
    });
  } catch {
    return NextResponse.json({ user: null, savedJobIds: [] });
  }
}
