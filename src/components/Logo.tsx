"use client";

import { useTheme } from "./ThemeProvider";

export default function Logo() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const wordColor = isDark ? "#f9fafb" : "#020617";
  const borderColor = isDark ? "#374151" : "#e5e7eb";

  return (
    <svg viewBox="0 0 240 64" role="img" aria-labelledby="title desc" className="h-12 w-auto">
      <title id="title">QRWing</title>
      <desc id="desc">A scannable QR code for https://qrwing.vercel.app/ beside the QRWing wordmark.</desc>
      <defs>
        <linearGradient id="qrwingAccent" x1="82" y1="12" x2="216" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4c1d95"/>
          <stop offset="0.55" stopColor="#7c3aed"/>
          <stop offset="1" stopColor="#a78bfa"/>
        </linearGradient>
      </defs>

      <rect x="4" y="4" width="56" height="56" rx="12" fill="#ffffff"/>
      <rect x="4.5" y="4.5" width="55" height="55" rx="11.5" fill="none" stroke={borderColor}/>
      <g fill="#111827" transform="translate(-4 -4) scale(1.6)">
        <path d="M10 10h1v1h-1zM11 10h1v1h-1zM12 10h1v1h-1zM13 10h1v1h-1zM14 10h1v1h-1zM15 10h1v1h-1zM16 10h1v1h-1zM18 10h1v1h-1zM19 10h1v1h-1zM21 10h1v1h-1zM23 10h1v1h-1zM28 10h1v1h-1zM29 10h1v1h-1zM30 10h1v1h-1zM31 10h1v1h-1zM32 10h1v1h-1zM33 10h1v1h-1zM34 10h1v1h-1zM10 11h1v1h-1zM16 11h1v1h-1zM18 11h1v1h-1zM21 11h1v1h-1zM24 11h1v1h-1zM26 11h1v1h-1zM28 11h1v1h-1zM34 11h1v1h-1zM10 12h1v1h-1zM12 12h1v1h-1zM13 12h1v1h-1zM14 12h1v1h-1zM16 12h1v1h-1zM18 12h1v1h-1zM19 12h1v1h-1zM21 12h1v1h-1zM23 12h1v1h-1zM25 12h1v1h-1zM28 12h1v1h-1zM30 12h1v1h-1zM31 12h1v1h-1zM32 12h1v1h-1zM34 12h1v1h-1zM10 13h1v1h-1zM12 13h1v1h-1zM13 13h1v1h-1zM14 13h1v1h-1zM16 13h1v1h-1zM19 13h1v1h-1zM23 13h1v1h-1zM26 13h1v1h-1zM28 13h1v1h-1zM30 13h1v1h-1zM31 13h1v1h-1zM32 13h1v1h-1zM34 13h1v1h-1zM10 14h1v1h-1zM12 14h1v1h-1zM13 14h1v1h-1zM14 14h1v1h-1zM16 14h1v1h-1zM18 14h1v1h-1zM19 14h1v1h-1zM24 14h1v1h-1zM26 14h1v1h-1zM28 14h1v1h-1zM30 14h1v1h-1zM31 14h1v1h-1zM32 14h1v1h-1zM34 14h1v1h-1zM10 15h1v1h-1zM16 15h1v1h-1zM20 15h1v1h-1zM22 15h1v1h-1zM23 15h1v1h-1zM26 15h1v1h-1zM28 15h1v1h-1zM34 15h1v1h-1zM10 16h1v1h-1zM11 16h1v1h-1zM12 16h1v1h-1zM13 16h1v1h-1zM14 16h1v1h-1zM15 16h1v1h-1zM16 16h1v1h-1zM18 16h1v1h-1zM20 16h1v1h-1zM22 16h1v1h-1zM24 16h1v1h-1zM26 16h1v1h-1zM28 16h1v1h-1zM29 16h1v1h-1zM30 16h1v1h-1zM31 16h1v1h-1zM32 16h1v1h-1zM33 16h1v1h-1zM34 16h1v1h-1zM19 17h1v1h-1zM21 17h1v1h-1zM22 17h1v1h-1zM23 17h1v1h-1zM25 17h1v1h-1zM26 17h1v1h-1zM10 18h1v1h-1zM13 18h1v1h-1zM14 18h1v1h-1zM15 18h1v1h-1zM16 18h1v1h-1zM17 18h1v1h-1zM18 18h1v1h-1zM20 18h1v1h-1zM21 18h1v1h-1zM24 18h1v1h-1zM25 18h1v1h-1zM27 18h1v1h-1zM30 18h1v1h-1zM32 18h1v1h-1zM33 18h1v1h-1zM34 18h1v1h-1zM12 19h1v1h-1zM15 19h1v1h-1zM17 19h1v1h-1zM24 19h1v1h-1zM25 19h1v1h-1zM27 19h1v1h-1zM29 19h1v1h-1zM30 19h1v1h-1zM31 19h1v1h-1zM32 19h1v1h-1zM33 19h1v1h-1zM10 20h1v1h-1zM11 20h1v1h-1zM16 20h1v1h-1zM20 20h1v1h-1zM21 20h1v1h-1zM25 20h1v1h-1zM27 20h1v1h-1zM28 20h1v1h-1zM29 20h1v1h-1zM30 20h1v1h-1zM31 20h1v1h-1zM34 20h1v1h-1zM10 21h1v1h-1zM15 21h1v1h-1zM18 21h1v1h-1zM19 21h1v1h-1zM21 21h1v1h-1zM22 21h1v1h-1zM24 21h1v1h-1zM25 21h1v1h-1zM27 21h1v1h-1zM31 21h1v1h-1zM32 21h1v1h-1zM33 21h1v1h-1zM34 21h1v1h-1zM11 22h1v1h-1zM12 22h1v1h-1zM13 22h1v1h-1zM15 22h1v1h-1zM19 22h1v1h-1zM21 22h1v1h-1zM23 22h1v1h-1zM27 22h1v1h-1zM29 22h1v1h-1zM31 22h1v1h-1zM33 22h1v1h-1zM34 22h1v1h-1zM24 23h1v1h-1zM29 23h1v1h-1zM32 23h1v1h-1zM33 23h1v1h-1zM34 23h1v1h-1zM25 24h1v1h-1zM27 24h1v1h-1zM29 24h1v1h-1zM31 24h1v1h-1zM34 24h1v1h-1z"/>
      </g>

      <g fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">
        <text x="76" y="42" fill={wordColor} fontSize="38" fontWeight="950" paintOrder="stroke" stroke={isDark ? "#111827" : "#ffffff"} strokeWidth="0.65">QR</text>
        <text x="130" y="42" fill="url(#qrwingAccent)" fontSize="38" fontWeight="820">Wing</text>
      </g>
      <path d="M131 51h66" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" opacity="0.24"/>
    </svg>
  );
}
