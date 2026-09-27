type QrisCodeProps = {
  className?: string;
};

export function QrisCode({ className }: QrisCodeProps) {
  return (
    <svg viewBox="0 0 160 160" className={className} fill="currentColor" aria-hidden="true">
      <rect x="10" y="10" width="40" height="40" rx="3" />
      <rect x="16" y="16" width="28" height="28" rx="2" fill="var(--surface)" />
      <rect x="22" y="22" width="16" height="16" rx="1" />

      <rect x="110" y="10" width="40" height="40" rx="3" />
      <rect x="116" y="16" width="28" height="28" rx="2" fill="var(--surface)" />
      <rect x="122" y="22" width="16" height="16" rx="1" />

      <rect x="10" y="110" width="40" height="40" rx="3" />
      <rect x="16" y="116" width="28" height="28" rx="2" fill="var(--surface)" />
      <rect x="22" y="122" width="16" height="16" rx="1" />

      <rect x="56" y="22" width="6" height="6" />
      <rect x="68" y="22" width="6" height="6" />
      <rect x="80" y="22" width="6" height="6" />
      <rect x="92" y="22" width="6" height="6" />
      <rect x="56" y="56" width="12" height="12" rx="1" />
      <rect x="74" y="56" width="6" height="6" />
      <rect x="86" y="56" width="18" height="6" />
      <rect x="68" y="68" width="12" height="12" rx="1" />
      <rect x="86" y="68" width="6" height="6" />
      <rect x="98" y="68" width="12" height="18" />
      <rect x="116" y="56" width="12" height="6" />
      <rect x="56" y="92" width="18" height="6" />
      <rect x="80" y="86" width="12" height="12" rx="1" />
      <rect x="98" y="92" width="6" height="6" />
      <rect x="110" y="80" width="12" height="12" />
      <rect x="56" y="110" width="12" height="18" />
      <rect x="74" y="110" width="18" height="6" />
      <rect x="98" y="116" width="12" height="12" />

      <rect x="68" y="70" width="24" height="20" rx="3" fill="var(--brand)" />
      <text x="80" y="84" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
        QRIS
      </text>
    </svg>
  );
}
