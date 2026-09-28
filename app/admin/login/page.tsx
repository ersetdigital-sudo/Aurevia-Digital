"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { LogoMark } from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !password) return;

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
        setBusy(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server. Periksa koneksi lalu coba lagi.");
      setBusy(false);
    }
  }

  return (
    <div className="admin adm-login">
      <form onSubmit={handleSubmit} className="adm-card adm-login-card">
        <div className="adm-login-brand">
          <LogoMark className="h-11 w-11" />
          <div className="min-w-0">
            <p className="adm-brand-name">Aurevia Digital</p>
            <p className="adm-brand-sub">Panel Admin</p>
          </div>
        </div>

        <h1 className="adm-login-title">Masuk dashboard</h1>
        <p className="adm-login-sub">
          Kelola katalog, pesanan, pesan masuk, dan pengaturan QRIS dari satu tempat.
        </p>

        <div className="adm-login-field">
          <label className="adm-label" htmlFor="admin-password">
            Password admin
          </label>

          <div className="adm-login-input">
            <Icon name="lock" />
            <input
              id="admin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              className="adm-input adm-login-password"
              autoComplete="current-password"
              autoFocus
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError(null);
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "admin-login-error" : "admin-login-hint"}
              placeholder="Masukkan password"
            />
            <button
              type="button"
              className="adm-login-toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              tabIndex={-1}
            >
              <Icon name={showPassword ? "eyeOff" : "eye"} className="h-[17px] w-[17px]" />
            </button>
          </div>

          {error ? (
            <p id="admin-login-error" role="alert" className="adm-login-alert">
              <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          ) : (
            <p id="admin-login-hint" className="adm-hint">
              Password diambil dari environment variable <code>ADMIN_PASSWORD</code>.
            </p>
          )}
        </div>

        <button type="submit" className="btn btn-primary adm-login-submit" disabled={busy || !password}>
          {busy ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
              Memeriksa…
            </>
          ) : (
            <>
              Masuk
              <Icon name="arrow" className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="adm-login-meta">
          <span>
            <Icon name="clock" className="h-[15px] w-[15px]" />
            Sesi aktif 12 jam
          </span>
          <Link href="/">
            <Icon name="arrow" className="h-[15px] w-[15px]" />
            Kembali ke situs
          </Link>
        </div>
      </form>
    </div>
  );
}
