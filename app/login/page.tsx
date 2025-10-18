// app/login/page.tsx
"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@user.com");
  const [name, setName] = useState("Demo User");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    });
    if (res.ok) {
      // send them back to dashboard
      window.location.href = "/dashboard";
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j?.error ?? "Login failed");
      setLoading(false);
    }
  }

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold">Log in</h1>
      <p className="opacity-80 mt-2">Demo login that issues a JWT cookie.</p>

      <form onSubmit={onSubmit} className="mt-6 max-w-md space-y-4">
        <input
          className="w-full rounded-xl border px-3 py-2 bg-transparent"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full rounded-xl border px-3 py-2 bg-transparent"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          className="rounded-xl px-4 py-2 border"
          disabled={loading}
          type="submit"
        >
          {loading ? "Signing in..." : "Continue"}
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </main>
  );
}
