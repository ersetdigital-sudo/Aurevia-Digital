import Link from "next/link";
import { cn } from "@/lib/cn";

type LogoProps = {
  href?: string;
  className?: string;
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={cn("h-8 w-8 shrink-0", className)}
    >
      <defs>
        <linearGradient id="ad-tile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F97316" />
          <stop offset="1" stopColor="#C2410C" />
        </linearGradient>
        <linearGradient id="ad-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ad-bar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FDE68A" />
          <stop offset="1" stopColor="#FDBA74" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#ad-tile)" />
      <rect width="32" height="32" rx="9" fill="url(#ad-sheen)" />
      <g fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round">
        <path d="M16 8.5 9.5 24" />
        <path d="m16 8.5 6.5 15.5" />
      </g>
      <path
        d="M12.2 18.8h7.6"
        stroke="url(#ad-bar)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ href, className }: LogoProps) {
  const content = (
    <>
      <LogoMark />
      <span className="text-lg leading-none font-extrabold tracking-[-0.01em]">
        Aurevia <span className="font-bold text-muted">Digital</span>
      </span>
    </>
  );

  const classes = cn("flex items-center gap-2.5", className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
