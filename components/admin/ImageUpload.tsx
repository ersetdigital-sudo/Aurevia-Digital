"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { cldImg, publicIdFromUrl } from "@/lib/cloudinary";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

type SignResponse = {
  signature: string;
  timestamp: number;
  apiKey: string;
  uploadUrl: string;
  uploadPreset?: string;
  destroyUrl?: string;
};

type ImageUploadProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
};

/**
 * Upload gambar admin -> Cloudinary (signed).
 * Signature diambil dari /api/cloudinary/sign; API secret tidak pernah
 * menyentuh browser. Preview tampil sebelum & sesudah upload.
 */
export function ImageUpload({ label, value, onChange, hint }: ImageUploadProps) {
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
      const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upload" }),
      });
      if (!signRes.ok) throw new Error(((await signRes.json().catch(() => ({}))) as { error?: string }).error ?? "Gagal menandatangani upload.");
      const sign = (await signRes.json()) as SignResponse;

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sign.apiKey);
      form.append("timestamp", String(sign.timestamp));
      form.append("signature", sign.signature);
      form.append("upload_preset", sign.uploadPreset ?? "");

      const uploadRes = await fetch(sign.uploadUrl, { method: "POST", body: form });
      const uploadData = (await uploadRes.json()) as {
        secure_url?: string;
        error?: { message?: string };
      };
      if (!uploadRes.ok || !uploadData.secure_url) {
        throw new Error(uploadData.error?.message ?? "Upload Cloudinary gagal.");
      }

      const oldUrl = value;
      onChange(uploadData.secure_url);

      // buang gambar lama supaya tidak menumpuk di folder Cloudinary
      const oldPublicId = publicIdFromUrl(oldUrl);
      if (oldPublicId) {
        void destroyImage(oldPublicId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat upload.");
      setLocalPreview(null);
    } finally {
      setBusy(false);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function destroyImage(publicId: string) {
    try {
      const signRes = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "destroy", public_id: publicId }),
      });
      if (!signRes.ok) return;
      const sign = (await signRes.json()) as SignResponse;
      const form = new FormData();
      form.append("public_id", publicId);
      form.append("api_key", sign.apiKey);
      form.append("timestamp", String(sign.timestamp));
      form.append("signature", sign.signature);
      await fetch(sign.destroyUrl ?? "", { method: "POST", body: form });
    } catch {
      /* gambar lama gagal dihapus tidak menghalangi simpan */
    }
  }

  const shown = localPreview ?? (value ? cldImg(value, 240) : "");

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
                  const publicId = publicIdFromUrl(value);
                  if (publicId) void destroyImage(publicId);
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
