import { MessagesManager } from "@/components/admin/MessagesManager";
import { adminClient } from "@/lib/supabase";
import type { DbMessage } from "@/types";

export const metadata = { title: "Kontak Masuk" };

export default async function AdminMessagesPage() {
  const { data, error } = await adminClient()
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <div className="adm-card adm-card-pad" style={{ color: "var(--bad)" }}>
        Gagal memuat pesan: {error.message}
      </div>
    );
  }

  return <MessagesManager messages={(data ?? []) as DbMessage[]} />;
}
