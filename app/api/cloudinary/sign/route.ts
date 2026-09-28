import { NextResponse } from "next/server";
import {
  cloudinaryApiKey,
  cloudinaryCloudName,
  cloudinaryConfigured,
  cloudinarySignature,
  cloudinaryUploadPreset,
  destroyParams,
  uploadParams,
} from "@/lib/cloudinary";
import { badRequest, guard, str } from "@/lib/adminApi";

/**
 * POST /api/cloudinary/sign
 * Body: { action: "upload" }                  -> parameter upload bertanda tangan
 * Body: { action: "destroy", public_id }       -> parameter hapus bertanda tangan
 *
 * API secret tidak pernah menyentuh browser — hanya dipakai untuk menghitung
 * signature di server (env Vercel).
 */
export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  if (!cloudinaryConfigured) {
    return NextResponse.json({ error: "Cloudinary belum dikonfigurasi." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    action?: string;
    public_id?: string;
  };

  if (body.action === "upload") {
    const params = uploadParams();
    return NextResponse.json({
      signature: cloudinarySignature(params),
      timestamp: params.timestamp,
      apiKey: cloudinaryApiKey,
      cloudName: cloudinaryCloudName,
      uploadPreset: cloudinaryUploadPreset,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
    });
  }

  if (body.action === "destroy") {
    const publicId = str(body.public_id, "", 200);
    if (!publicId) return badRequest("public_id wajib diisi.");
    const params = destroyParams(publicId);
    return NextResponse.json({
      signature: cloudinarySignature(params),
      timestamp: params.timestamp,
      apiKey: cloudinaryApiKey,
      cloudName: cloudinaryCloudName,
      destroyUrl: `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/destroy`,
    });
  }

  return badRequest("Action tidak dikenal.");
}
