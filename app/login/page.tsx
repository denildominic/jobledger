// app/login/page.tsx
"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold">Log in</h1>
      <button
        className="mt-6 rounded-xl px-4 py-2 border"
        onClick={() => signIn("google", { callbackUrl: "/api/session-bridge" })}
      >
        Continue with Google
      </button>
    </main>
  );
}
