import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, createSessionToken, verifyPassword } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { password?: string };

  if (!(await verifyPassword(String(body.password ?? "")))) {
    return NextResponse.json({ error: "Password salah." }, { status: 401 });
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ ok: true });
}
