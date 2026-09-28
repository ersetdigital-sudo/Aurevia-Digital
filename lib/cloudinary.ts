import { createHash } from "crypto";

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME ?? "";
const API_KEY = process.env.CLOUDINARY_API_KEY ?? "";
const API_SECRET = process.env.CLOUDINARY_API_SECRET ?? "";
const PRESET = process.env.CLOUDINARY_UPLOAD_PRESET ?? "";

export const cloudinaryConfigured = Boolean(CLOUD && API_KEY && API_SECRET && PRESET);

/** SHA-1 (params terurut + api_secret) — sesuai aturan signed upload Cloudinary. */
export function cloudinarySignature(params: Record<string, string | number>): string {
  const query = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(query + API_SECRET).digest("hex");
}

export function uploadParams(): Record<string, string | number> {
  return { timestamp: Math.floor(Date.now() / 1000), upload_preset: PRESET };
}

export function destroyParams(publicId: string): Record<string, string | number> {
  return { public_id: publicId, timestamp: Math.floor(Date.now() / 1000) };
}

export { API_KEY as cloudinaryApiKey, CLOUD as cloudinaryCloudName, PRESET as cloudinaryUploadPreset };

/** Ambil public_id dari URL hasil upload (untuk endpoint destroy/hapus gambar). */
export function publicIdFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("cloudinary.com")) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex < 0) return null;
    const rest = parts
      .slice(uploadIndex + 1)
      .join("/")
      .replace(/^v\d+\//, "");
    return decodeURIComponent(rest.replace(/\.[a-zA-Z0-9]+$/, "")) || null;
  } catch {
    return null;
  }
}

/** Optimasi tampilan: f_auto + q_auto (+ lebar opsional) sesuai panduan hemat kredit. */
export function cldImg(url: string, width?: number): string {
  if (!url || !url.includes("res.cloudinary.com") || url.includes("/upload/f_auto")) return url;
  const transforms = ["f_auto", "q_auto", ...(width ? [`w_${width}`] : [])].join(",");
  return url.replace("/image/upload/", `/image/upload/${transforms}/`);
}
