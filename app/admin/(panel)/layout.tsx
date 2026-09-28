import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Shell } from "@/components/admin/Shell";
import { isAdmin } from "@/lib/adminAuth";

// admin.css sudah dimuat di app/admin/layout.tsx (berlaku untuk login juga).
export const metadata = {
  title: { template: "%s | Panel Admin", default: "Panel Admin" },
};

export default async function PanelLayout({ children }: { children: ReactNode }) {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  return <Shell>{children}</Shell>;
}
