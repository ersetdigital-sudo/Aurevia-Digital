"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

type ImageUploadProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  /** Subfolder di bucket (huruf kecil, angka, tanda hubung), mis. "produk" atau "qris". */
  folder?: string;
};

/**
 * Upload gambar admin -> /api/admin/upload -> Supabase Storage (bucket `images`).
 * Service key tidak pernah menyentuh browser. Preview tampil sebelum & sesudah upload.
 *
 * Gambar lama TIDAK dihapus di sini: API simpan menghapusnya setelah perubahan
 * berhasil disimpan, jadi membatalkan perubahan tidak membuat gambar aktif hilang.
 */
export function ImageUpload({ label, value, onChange, hint, folder = "umum" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);

    if (!ALLOWED.includes(file.type)) {
      setError("Format harus JPG, PNG, atau WEBP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError(`Ukuran maksimal 2 MB (file ini ${(file.size / 1024 / 1024).toFixed(2)} MB).`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setBusy(true);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Upload gagal.");
      if (!data.url) throw new Error("URL gambar tidak diterima.");

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat upload.");
      setLocalPreview(null);
    } finally {
      setBusy(false);
      URL.revokeObjectURL(objectUrl);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const shown = localPreview ?? value;

  return (
    <div>
      <label className="adm-label">{label}</label>
      <div className="adm-upload">
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={shown} alt="Preview gambar" className="adm-upload-preview" />
        ) : (
          <span className="adm-upload-empty">
            <Icon name="search" className="h-5 w-5" />
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              <Icon name={busy ? "clock" : "arrow"} className="h-4 w-4" />
              {busy ? "Mengupload…" : shown ? "Ganti gambar" : "Pilih gambar"}
            </button>

            {value ? (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                disabled={busy}
                onClick={() => {
                  setLocalPreview(null);
                  onChange("");
                }}
              >
                Hapus
              </button>
            ) : null}
          </div>
          <p className="adm-hint">{hint ?? "JPG / PNG / WEBP, maksimal 2 MB."}</p>
          {error ? (
            <p className="adm-hint" style={{ color: "var(--bad)", fontWeight: 700 }}>
              {error}
            </p>
          ) : null}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
      </div>
    </div>
  );
}
