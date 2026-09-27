import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";

export const plusJakartaSans = localFont({
  src: [
    { path: "./fonts/plusjakartasans-regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/plusjakartasans-medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/plusjakartasans-semibold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/plusjakartasans-bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/plusjakartasans-extrabold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-plus-jakarta",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  fallback: ["Georgia", "serif"],
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  fallback: ["ui-monospace", "monospace"],
});
