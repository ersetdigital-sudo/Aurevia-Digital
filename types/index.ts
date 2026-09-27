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

