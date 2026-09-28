// Hook resolver: menerjemahkan alias "@/..." (tsconfig paths) jadi path file asli
// supaya script Node biasa bisa mengimpor modul project tanpa build step.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith("@/")) return nextResolve(specifier, context);

  const base = new URL(specifier.slice(2), root);
  const candidates = [base, new URL(`${base.href}.ts`), new URL(`${base.href}/index.ts`)];

  for (const candidate of candidates) {
    if (existsSync(fileURLToPath(candidate))) return nextResolve(candidate.href, context);
  }

  return nextResolve(specifier, context);
}
