"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { QrisSettings, SiteSettings } from "@/types";

type Props = {
  initialQris: QrisSettings;
  initialSite: SiteSettings;
};

export function SettingsForm({ initialQris, initialSite }: Props) {
  const router = useRouter();
  const [qris, setQris] = useState<QrisSettings>(initialQris);
  const [site, setSite] = useState<SiteSettings>(initialSite);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function save(key: "qris" | "site", value: QrisSettings | SiteSettings, label: string) {
    setBusy(key);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan.");
      setToast(`${label} tersimpan.`);
      router.refresh();
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setBusy(null);
      window.setTimeout(() => setToast(null), 3000);
    }
  }

  function handleQris(event: FormEvent) {
    event.preventDefault();
    void save("qris", qris, "Pengaturan QRIS");
  }

  function handleSite(event: FormEvent) {
    event.preventDefault();
    void save("site", site, "Pengaturan situs");
  }

  return (
    <div className="space-y-5">
      <header>
        <p className="adm-eyebrow">Konfigurasi</p>
        <h1 className="adm-page-title">Pengaturan</h1>
        <p className="adm-page-sub">
          Foto QRIS tampil pada langkah pembayaran checkout, dan info kontak dipakai di
          halaman bantuan.
        </p>
      </header>

      <form onSubmit={handleQris} className="adm-card">
        <div className="adm-card-head">
          <span className="adm-card-title">QRIS Pembayaran</span>
          <span className={`badge ${qris.image_url ? "badge-ok" : "badge-warn"}`}>
            {qris.image_url ? "Foto terpasang" : "Belum ada foto"}
          </span>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <ImageUpload
              label="Foto QRIS"
              value={qris.image_url}
              onChange={(url) => setQris({ ...qris, image_url: url })}
              hint="PNG/JPG hasil export QRIS dari bank atau payment gateway, maksimal 2 MB."
            />
          </div>

          <label>
            <span className="adm-label">Nama merchant (tercetak di QRIS)</span>
            <input
              className="adm-input"
              value={qris.merchant}
              onChange={(event) => setQris({ ...qris, merchant: event.target.value })}
            />
          </label>

          <label>
            <span className="adm-label">Catatan di bawah QRIS</span>
            <input
              className="adm-input"
              value={qris.note}
              onChange={(event) => setQris({ ...qris, note: event.target.value })}
            />
          </label>

          <div className="lg:col-span-2">
            <button type="submit" className="btn btn-primary" disabled={busy === "qris"}>
              <Icon name={busy === "qris" ? "clock" : "check"} className="h-4 w-4" />
              {busy === "qris" ? "Menyimpan…" : "Simpan pengaturan QRIS"}
            </button>
          </div>
        </div>
      </form>

      <form onSubmit={handleSite} className="adm-card">
        <div className="adm-card-head">
          <span className="adm-card-title">Informasi Situs</span>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-2">
          <label className="lg:col-span-2">
            <span className="adm-label">Pengumuman (opsional)</span>
            <input
              className="adm-input"
              value={site.announcement}
              onChange={(event) => setSite({ ...site, announcement: event.target.value })}
              placeholder="mis. Layanan PLN gangguan, estimasi normal 2 jam"
            />
            <span className="adm-hint">Kosongkan untuk menyembunyikan pengumuman.</span>
          </label>

          <label>
            <span className="adm-label">Nomor WhatsApp dukungan</span>
            <input
              className="adm-input"
              value={site.wa}
              onChange={(event) => setSite({ ...site, wa: event.target.value })}
              placeholder="62812xxxxxxx"
            />
          </label>

          <label>
            <span className="adm-label">Email dukungan</span>
            <input
              className="adm-input"
              type="email"
              value={site.email}
              onChange={(event) => setSite({ ...site, email: event.target.value })}
              placeholder="halo@aureviadigital.net"
            />
          </label>

          <div className="lg:col-span-2">
            <button type="submit" className="btn btn-primary" disabled={busy === "site"}>
              <Icon name={busy === "site" ? "clock" : "check"} className="h-4 w-4" />
              {busy === "site" ? "Menyimpan…" : "Simpan informasi situs"}
            </button>
          </div>
        </div>
      </form>

      {toast ? <div className="adm-toast">{toast}</div> : null}
    </div>
  );
}
