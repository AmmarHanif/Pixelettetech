/**
 * Inline SVG icon set, ported from the design.
 *
 * All icons are `aria-hidden` and inherit `currentColor` so a themed section
 * (the amber Blockchain practice) recolours them without a second asset.
 */

type IconProps = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  fill: 'none' as const,
  'aria-hidden': true as const,
  focusable: 'false' as const,
});

export function Check({ size = 15, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 15 15" className={className}>
      <path
        d="M3 8l3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRight({ size = 17, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 17 17" className={className}>
      <path
        d="M3 8.5h10M9 4.5l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowUpRight({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 14 14" className={className}>
      <path
        d="M4 10L10 4M10 4H5M10 4v5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Build practice: code brackets. */
export function BuildMark({ size = 30, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 34 34" className={className}>
      <path
        d="M12 6L4 17l8 11M22 6l8 11-8 11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Blockchain practice: linked blocks. */
export function ChainMark({ size = 30, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 34 34" className={className}>
      <rect x="3" y="3" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="20" y="20" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="20" y="3" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M8.5 14v11h11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Shield({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <path
        d="M12 3l7 3v6c0 4.2-2.9 7.7-7 9-4.1-1.3-7-4.8-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Gauge({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <path
        d="M4 17a8 8 0 1116 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M12 17l4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Layers({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <path
        d="M12 3l8 4.5-8 4.5-8-4.5L12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4 12.5L12 17l8-4.5M4 16.5L12 21l8-4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Cpu({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="10" y="10" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Database({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <ellipse cx="12" cy="6" rx="7" ry="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function Mobile({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 18h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Window({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9h18" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="6.5" cy="6.5" r=".9" fill="currentColor" />
    </svg>
  );
}

export function Pen({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <path
        d="M4 20l4-1 10-10a2.1 2.1 0 10-3-3L5 16l-1 4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Cloud({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <path
        d="M7 18h10a4 4 0 00.6-7.96A6 6 0 006 9.5 3.5 3.5 0 007 18z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Mail({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function Pin({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <path
        d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Star({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden focusable="false" className={className}>
      <path
        d="M8 1.6l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.4l-3.8 2 .7-4.3-3.1-3 4.3-.6L8 1.6z"
        fill="currentColor"
      />
    </svg>
  );
}
