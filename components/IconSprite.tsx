import { icons } from "@/lib/icons";

/**
 * Sprite SVG tersembunyi. Semua <Icon /> menunjuk ke simbol di sini lewat <use />,
 * jadi path ikon hanya dikirim sekali walau dipakai berkali-kali.
 */
export function IconSprite() {
  return (
    <svg width={0} height={0} className="absolute" aria-hidden="true" focusable="false">
      <defs>
        {Object.entries(icons).map(([name, children]) => (
          <g key={name} id={`i-${name}`}>
            {children}
          </g>
        ))}
      </defs>
    </svg>
  );
}
