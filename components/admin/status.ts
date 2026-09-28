import type { MessageStatus, OrderStatus } from "@/types";

export const ORDER_STATUS: Record<OrderStatus, { label: string; cls: string }> = {
  pending: { label: "Menunggu Bayar", cls: "badge-warn" },
  paid: { label: "Dibayar", cls: "badge-info" },
  processing: { label: "Diproses", cls: "badge-info" },
  success: { label: "Berhasil", cls: "badge-ok" },
  failed: { label: "Gagal", cls: "badge-bad" },
  refunded: { label: "Refund", cls: "badge-mute" },
};

export const ORDER_STATUS_VALUES = Object.keys(ORDER_STATUS) as OrderStatus[];

export const MESSAGE_STATUS: Record<MessageStatus, { label: string; cls: string }> = {
  new: { label: "Baru", cls: "badge-clay" },
  read: { label: "Dibaca", cls: "badge-info" },
  replied: { label: "Dibalas", cls: "badge-ok" },
};

export function rupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
