import type { ReactNode } from "react";

export const icons = {
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </>
  ),
  bolt: <path d="M13.5 2.5 5 13.5h5.5L10 21.5 19 10.5h-5.5z" strokeLinejoin="round" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 9.5h17.6M3.2 14.5h17.6" />
      <path d="M12 3c2.6 3 2.6 15 0 18-2.6-3-2.6-15 0-18z" />
    </>
  ),
  droplet: <path d="M12 3s6 6.2 6 10a6 6 0 0 1-12 0c0-3.8 6-10 6-10z" strokeLinejoin="round" />,
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.2 3 7.6 7 9.5 4-1.9 7-5.3 7-9.5V6z" strokeLinejoin="round" />
      <path d="m9.2 12 2 2.2 3.6-4" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 9.2a14 14 0 0 1 19 0" />
      <path d="M6 12.6a9 9 0 0 1 12 0" />
      <path d="M9.3 16a4.5 4.5 0 0 1 5.4 0" />
      <circle cx="12" cy="19.2" r="1" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 9.8h19" />
      <path d="M6 14.5h4" />
    </>
  ),
  eye: (
    <>
      <path
        d="M2.5 12S6 5.6 12 5.6 21.5 12 21.5 12 18 18.4 12 18.4 2.5 12 2.5 12z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M4 4.5l15.5 15.5" />
      <path d="M10 5.9A9.9 9.9 0 0 1 12 5.6c6 0 9.5 6.4 9.5 6.4a17.6 17.6 0 0 1-3.3 4" />
      <path d="M6.4 7.9A17.4 17.4 0 0 0 2.5 12S6 18.4 12 18.4c1.1 0 2.1-.2 3-.5" />
      <path d="M9.9 10a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  car: (
    <>
      <path d="M4 16v2.5M20 16v2.5" />
      <path d="M3 15.5v-3l2-4.5h14l2 4.5v3z" strokeLinejoin="round" />
      <circle cx="7.5" cy="15.5" r="1.4" />
      <circle cx="16.5" cy="15.5" r="1.4" />
    </>
  ),
  percent: (
    <>
      <path d="M6 18 18 6" />
      <circle cx="7.8" cy="7.8" r="2.3" />
      <circle cx="16.2" cy="16.2" r="2.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.3 2" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="9" width="17" height="11.5" rx="2" />
      <path d="M2.5 9h19v3.5h-19zM12 9v11.5" />
      <path d="M12 9S9.5 4 7.6 5.3C6 6.4 8 9 12 9zM12 9s2.5-5 4.4-3.7C18 6.4 16 9 12 9z" />
    </>
  ),
  tag: (
    <>
      <path d="M11 3.5H4.5V10L14 19.5l6.5-6.5z" strokeLinejoin="round" />
      <circle cx="8.2" cy="7.2" r="1.3" />
    </>
  ),
  bell: (
    <>
      <path d="M6.5 16.5V11a5.5 5.5 0 1 1 11 0v5.5l1.5 2h-14z" strokeLinejoin="round" />
      <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
      <path d="M8.2 10V7.5a3.8 3.8 0 0 1 7.6 0V10" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c0-3.2 2.7-5 6-5s6 1.8 6 5" />
      <path d="M16.5 7.6a3 3 0 0 1 0 5.6M17.5 15.2c2 .7 3 2.2 3 4.3" />
    </>
  ),
  chart: (
    <>
      <path d="M3.5 20h17" />
      <path d="m4.5 15.5 4.5-5 3.5 3 6.5-7.5" />
      <path d="M15.5 6h4v4" />
    </>
  ),
  doc: (
    <>
      <path d="M6 3h7l5 5v13H6z" strokeLinejoin="round" />
      <path d="M13 3v5h5" />
      <path d="M9 13h6M9 16.5h6" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.2 12.2 2.6 2.6 5-5.6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.8 7.4 8.2 5.7 8.2-5.7" />
    </>
  ),
  chat: (
    <>
      <path
        d="M20.5 11.8c0 3.9-3.8 7-8.5 7-1 0-2-.14-2.9-.4L4.2 20l1.5-3.7C4.3 15.1 3.5 13.5 3.5 11.8 3.5 7.9 7.3 4.8 12 4.8s8.5 3.1 8.5 7z"
        strokeLinejoin="round"
      />
      <path d="M8.8 11.8h.01M12 11.8h.01M15.2 11.8h.01" />
    </>
  ),
  chevron: <path d="m6 9.5 6 6 6-6" />,
  alert: (
    <>
      <path d="M12 4.4 2.9 19.6h18.2z" strokeLinejoin="round" />
      <path d="M12 10v4.1M12 17h.01" />
    </>
  ),
  menu: <path d="M4 7.5h16M4 12h16M4 16.5h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  arrow: (
    <>
      <path d="M4.5 12h14" />
      <path d="m13 6.5 5.5 5.5-5.5 5.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" strokeLinejoin="round" />,
  ig: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" />
    </>
  ),
  yt: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10.3 9.3 5 2.7-5 2.7z" strokeLinejoin="round" />
    </>
  ),
  tt: (
    <>
      <path d="M14 3.5v11.2a4 4 0 1 1-3.3-3.9" />
      <path d="M14 6.2c.9 1.7 2.5 2.7 4.5 2.8" />
    </>
  ),
  fb: (
    <path
      d="M14.5 21v-8h2.7l.5-3.2h-3.2V7.7c0-.9.3-1.6 1.7-1.6h1.6V3.2c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.5H8.5V13h2.8v8z"
      strokeLinejoin="round"
    />
  ),
  x: <path d="M4.5 4.5 19.5 19.5M19.5 4.5 4.5 19.5" />,
  qr: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3.5v3.5H14zM19 14h2M14 19h2M18.5 18.5H21V21h-2.5z" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof icons;
