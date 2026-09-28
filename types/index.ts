import type { IconName } from "@/lib/icons";

export type NavItem = {
  label: string;
  href: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  tileClassName: string;
  items: string[];
};

export type Feature = {
  icon: IconName;
  title: string;
  description: string;
};

export type IconLabel = {
  icon: IconName;
  label: string;
};

export type PulsaPackage = {
  nominal: string;
  price: string;
  badge?: string;
};

export type Operator = {
  id: string;
  name: string;
  packages: PulsaPackage[];
};

export type Step = {
  icon: IconName;
  title: string;
  description: string;
};

export type Stat = {
  icon: IconName;
  value: string;
  label: string;
};

export type SocialLink = {
  label: string;
  icon: IconName;
  href: string;
};

export type TextLink = {
  label: string;
  href: string;
};

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
};

export type LegalDocMeta = {
  effectiveDate: string;
  lastUpdated: string;
  version: string;
};

export type LegalDoc = {
  title: string;
  intro: string;
  outro: string;
  meta: LegalDocMeta;
  sections: LegalSection[];
};

export type CheckoutItem = {
  label: string;
  detail: string;
  price: number;
  variable?: boolean;
};

export type CheckoutGroup = {
  name: string;
  items: CheckoutItem[];
};

export type CheckoutCategory = {
  id: string;
  nominalTitle: string;
  field: {
    label: string;
    placeholder: string;
    hint: string;
  };
  admin: number;
  groups: CheckoutGroup[];
};

// =========================================================
// Baris database (Supabase) — dipakai admin & data dinamis
// =========================================================

export type DbCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  tile_class: string;
  description: string;
  sort: number;
  active: boolean;
  nominal_title: string;
  field_label: string;
  field_placeholder: string;
  field_hint: string;
  admin_fee: number;
  created_at: string;
};

export type DbProduct = {
  id: string;
  category_id: string;
  name: string;
  detail: string;
  price: number;
  variable: boolean;
  image_url: string | null;
  group_name: string;
  sort: number;
  active: boolean;
  created_at: string;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "success"
  | "failed"
  | "refunded";

export type DbOrder = {
  id: string;
  ref: string;
  category: string;
  category_id: string | null;
  product: string;
  target: string;
  amount: number;
  status: OrderStatus;
  payment_method: string;
  invoice_no: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type MessageStatus = "new" | "read" | "replied";

export type DbMessage = {
  id: string;
  name: string;
  contact: string;
  subject: string;
  body: string;
  status: MessageStatus;
  created_at: string;
};

export type QrisSettings = {
  image_url: string;
  merchant: string;
  note: string;
};

export type SiteSettings = {
  announcement: string;
  wa: string;
  email: string;
};

