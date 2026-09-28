"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { LogoMark } from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Login gagal, coba lagi.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin adm-login">
      <form onSubmit={handleSubmit} className="adm-card adm-login-card">
        <div className="flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <div>
            <p className="adm-brand-name">Aurevia Digital</p>
            <p className="adm-brand-sub">Panel Admin</p>
          </div>
        </div>

        <h1
          className="mt-6"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          Masuk dashboard
        </h1>
        <p className="adm-hint" style={{ marginTop: 6 }}>
          Gunakan password admin yang terdaftar di environment variable.
        </p>

        <div style={{ marginTop: 20 }}>
          <label className="adm-label" htmlFor="admin-password">
            Password admin
          </label>
          <input
            id="admin-password"
            type="password"
            className="adm-input"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoFocus
          />
          {error ? (
            <p className="adm-hint" style={{ color: "var(--bad)", fontWeight: 700 }}>
              {error}
            </p>
          ) : null}
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 18 }} disabled={busy || !password}>
          <Icon name={busy ? "clock" : "arrow"} className="h-4 w-4" />
          {busy ? "Memeriksa…" : "Masuk"}
        </button>

        <Link
          href="/"
          className="adm-hint"
          style={{ display: "block", marginTop: 16, textAlign: "center" }}
        >
          ← Kembali ke situs
        </Link>
      </form>
    </div>
  );
}
