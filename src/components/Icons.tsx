/**
 * Inline SVG icon set, ported from the design.
 *
 * All icons are `aria-hidden` and inherit `currentColor` so a themed section
 * would recolour them without a second asset. No practice theme exists now -
 * the crimson Blockchain one was deleted on 2026-09-16 - but the inheritance is
 * the right default regardless.
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

/** Ruler. The Value Discovery is the measuring engagement. */
export function Measure({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <rect x="2" y="8" width="20" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M7 8v3.2M12 8v4.4M17 8v3.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Plotted trend against axes — evaluation is a measurement read over time. */
export function TrendChart({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <path
        d="M4 3.5v15a2 2 0 002 2h15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7.5 15.5l3.5-4.2 3 2.4 5-6.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="7.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
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

/**
 * The AI mark: the supplied brand artwork for AI engineering.
 *
 * Unlike the rest of this set it is a filled illustration on a 512 grid, not
 * a 24px line drawing, so it carries far more path data. The supplied fill was
 * a hard-coded #661A8E; it is `currentColor` here so the mark recolours with
 * its surrounding section like every other icon. In the places it is used that
 * resolves to --brand, which is the same purple.
 */
export function AiMark({ size = 24, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 512 512" className={className}>
      <path
        fill="currentColor"
        d="M508.6 220.5C508.6 208.2 498.6 198.1 486.2 198.1C483.4 198.1 480.8 198.7 478.3 199.6L433.1 137.6C436.2 133.8 438.1 129 438.1 123.7C438.1 111.3 428.1 101.3 415.7 101.3C409.9 101.3 404.7 103.5 400.7 107.2L335.7 66C336.4 63.9 336.8 61.7 336.8 59.5C336.8 47.1 326.8 37.1 314.4 37.1C304.1 37.1 295.5 44.1 292.9 53.6L206.8 53.6C204.2 44.1 195.6 37.1 185.3 37.1C172.9 37.1 162.9 47.1 162.9 59.5C162.9 61.7 163.3 63.7 163.8 65.7L96.1 107C92.1 103.2 86.7 100.8 80.8 100.8C68.4 100.8 58.4 110.9 58.4 123.2C58.4 129.5 61 135.1 65.1 139.2L30.6 200.9C28.9 200.5 27.1 200.2 25.2 200.2C12.9 200.2 2.8 210.2 2.8 222.6C2.8 234.9 12.9 245 25.2 245C25.3 245 25.4 245 25.4 245L40.4 297.8C33.9 301.7 29.6 308.8 29.6 316.9C29.6 329.3 39.6 339.3 52 339.3C60.2 339.3 67.4 334.7 71.3 328.1L106.4 337.3C106.5 348.8 115.4 358.2 126.7 359.3L139.5 431.8C131.9 435.4 126.6 443 126.6 452C126.6 464.3 136.6 474.4 149 474.4C161.3 474.4 171.4 464.3 171.4 452C171.4 447.8 170.2 444 168.2 440.7L222.1 385.6C227.1 388.9 233 390.6 239 390.6C248.8 390.6 257.6 386 263.2 378.8L298.9 396.9C298.6 398.4 298.4 399.9 298.4 401.5C298.4 413.8 308.4 423.9 320.8 423.9C333.2 423.9 343.2 413.8 343.2 401.5C343.2 395.7 340.9 390.4 337.3 386.4L365.5 341.9C367.6 342.6 369.8 343 372.1 343C383.1 343 392.3 334.9 394.1 324.3L442.6 319.5C445.8 327.9 453.9 333.9 463.5 333.9C475.8 333.9 485.9 323.9 485.9 311.6C485.9 303.2 481.2 296 474.4 292.1L486.7 242.8C498.8 242.6 508.6 232.7 508.6 220.5ZM52 327.5C46.1 327.5 41.4 322.8 41.4 316.9C41.4 311.1 46.1 306.3 52 306.3C57.8 306.3 62.6 311.1 62.6 316.9C62.6 322.8 57.8 327.5 52 327.5ZM52 294.5C51.9 294.5 51.8 294.5 51.7 294.5L36.8 241.7C40.2 239.6 43 236.7 44.9 233.1L77 240.5C77 240.8 77 241.1 77 241.5C77 258.6 90.9 272.5 108 272.5C108.3 272.5 108.5 272.5 108.7 272.5L118.5 317.3C114.7 319.3 111.6 322.3 109.5 325.9L74.3 316.7C74.2 304.4 64.2 294.5 52 294.5M25.2 212C31.1 212 35.8 216.7 35.8 222.6C35.8 228.5 31.1 233.2 25.2 233.2C19.4 233.2 14.6 228.5 14.6 222.6C14.6 216.7 19.4 212 25.2 212ZM486.2 209.9C489 209.9 491.7 211 493.7 213C495.7 215 496.8 217.7 496.8 220.5C496.8 226.4 492.1 231.1 486.2 231.1C480.4 231.1 475.6 226.4 475.6 220.5C475.6 217.7 476.7 215 478.7 213C480.7 211 483.4 209.9 486.2 209.9ZM455.2 290.8L412.8 234.3C415.1 231.5 416.7 228.3 417.7 224.8L464.5 225.9C466.1 231.9 470 236.9 475.3 239.9L463 289.2C460.2 289.3 457.6 289.8 455.2 290.8ZM463.4 322.2C457.6 322.2 452.8 317.4 452.8 311.6C452.8 305.7 457.6 300.9 463.4 300.9C469.3 300.9 474.1 305.7 474.1 311.6C474.1 317.4 469.3 322.2 463.4 322.2M320.8 412.1C314.9 412.1 310.2 407.3 310.2 401.5C310.2 395.6 314.9 390.8 320.8 390.8C326.6 390.8 331.4 395.6 331.4 401.5C331.4 407.3 326.6 412.1 320.8 412.1ZM80.8 112.6C86.7 112.6 91.4 117.4 91.4 123.2C91.4 129.1 86.7 133.8 80.8 133.8C74.9 133.8 70.2 129.1 70.2 123.2C70.2 117.4 74.9 112.6 80.8 112.6ZM181.6 81.5L186.2 125.1C180.9 126.5 175.9 129 171.6 132.4C167.3 135.8 163.7 140.1 161.2 145L103.1 124.7C103.1 124.2 103.2 123.7 103.2 123.2C103.2 121.1 102.8 119 102.2 117.1L169.9 75.8C173.2 78.8 177.2 80.8 181.6 81.5ZM314.4 48.8C320.3 48.8 325 53.6 325 59.5C325 65.3 320.3 70.1 314.4 70.1C308.6 70.1 303.8 65.3 303.8 59.5C303.8 53.6 308.6 48.8 314.4 48.8ZM185.3 70.1C179.4 70.1 174.6 65.4 174.6 59.5C174.6 53.6 179.4 48.9 185.3 48.9C191.1 48.9 195.9 53.6 195.9 59.5C195.9 65.4 191.1 70.1 185.3 70.1ZM329.4 76L394.4 117.1C393.8 119.1 393.4 121.1 393.4 123.3L345.9 135.4C341.1 124.4 331.1 116.3 319.1 114L319.8 81.1C323.4 80.2 326.7 78.5 329.4 76M239 329.2C226.3 329.2 215.3 337 210.7 348L151 335.7C150.8 331.3 149.3 327.3 146.9 324L176.3 287.6C180.7 290 185.7 291.2 190.7 291.2C205.6 291.2 218.1 280.5 220.8 266.3H252.2C253.8 278.1 260 288.3 269 295.2L248.8 330.8C245.6 329.7 242.3 329.2 239 329.2ZM295.5 216.7C285.4 216.7 276.1 220.2 268.6 226L228.3 186.5C232.8 180.2 235.4 172.6 235.7 164.8L277.1 160C281.5 175.4 295.6 186.7 312.3 186.7C321.4 186.7 329.8 183.4 336.2 177.8L371 207.2C369.3 210.6 368.2 214.3 368.2 218.4C368.2 219.8 368.4 221.2 368.7 222.6L332.9 238C325.3 225.2 311.4 216.7 295.5 216.7M295.5 228.5C313.1 228.5 327.4 242.8 327.4 260.5C327.4 278.1 313.1 292.4 295.5 292.4C277.8 292.4 263.5 278.1 263.5 260.5C263.5 242.8 277.8 228.5 295.5 228.5ZM196.2 135.6C211.5 135.6 224 148.1 224 163.4C224 178.7 211.5 191.2 196.2 191.2C180.9 191.2 168.4 178.7 168.4 163.4C168.4 148.1 180.8 135.6 196.2 135.6ZM190.7 241.5C201.1 241.5 209.6 250 209.6 260.5C209.6 270.9 201.1 279.4 190.7 279.4C180.2 279.4 171.7 270.9 171.7 260.5C171.7 250 180.2 241.5 190.7 241.5ZM312.3 174.9C298.6 174.9 287.5 163.8 287.5 150C287.5 136.3 298.6 125.2 312.3 125.2C326.1 125.2 337.2 136.3 337.2 150C337.2 163.8 326.1 174.9 312.3 174.9ZM170.8 193.8C177.9 199.7 186.9 203 196.2 203C205.1 203 213.4 200 220 194.9L260.4 234.4C256 240.3 253.1 247.3 252.2 254.6H220.8C218.1 240.4 205.6 229.7 190.7 229.7C178.2 229.7 167.4 237.2 162.6 248L139 242.5C139 242.2 139.1 241.8 139.1 241.5C139.1 235.7 137.5 230.3 134.7 225.7L170.8 193.8ZM393.4 205C400.8 205 406.8 211 406.8 218.4C406.8 225.8 400.8 231.8 393.4 231.8C386 231.8 380 225.8 380 218.4C380 211 386 205 393.4 205M127.3 241.5C127.3 252.1 118.6 260.7 108 260.7C97.4 260.7 88.8 252.1 88.8 241.5C88.8 230.9 97.4 222.2 108 222.2C118.7 222.2 127.3 230.9 127.3 241.5ZM136.4 254L160 259.5C160 259.8 159.9 260.1 159.9 260.5C159.9 267.7 162.5 274.7 167.1 280.2L137.7 316.6C135.3 315.5 132.7 314.9 130 314.8L120.2 270C127.4 266.9 133.2 261.2 136.4 254ZM418 213.1C415.6 201.7 405.5 193.2 393.4 193.2C387.8 193.2 382.7 195.1 378.6 198.2L343.8 168.8C347.2 163.2 349 156.7 349 150C349 149 348.9 147.9 348.8 146.8L396.3 134.7C400.2 141.5 407.4 146.1 415.7 146.1C418.5 146.1 421.2 145.5 423.6 144.6L468.8 206.6C467 208.8 465.7 211.4 464.9 214.1L418 213.1ZM128.8 326.5C134.6 326.5 139.4 331.2 139.4 337.1C139.4 342.9 134.6 347.7 128.8 347.7C122.9 347.7 118.2 342.9 118.2 337.1C118.2 331.2 122.9 326.5 128.8 326.5ZM415.7 113.1C421.6 113.1 426.3 117.8 426.3 123.7C426.3 126.5 425.2 129.2 423.2 131.2C421.2 133.2 418.5 134.3 415.7 134.3C412.9 134.3 410.2 133.2 408.2 131.2C406.2 129.2 405.1 126.5 405.1 123.7C405.1 120.9 406.2 118.2 408.2 116.2C410.2 114.2 412.9 113.1 415.7 113.1ZM292.9 65.4C293.9 69 295.8 72.3 298.5 75C301.1 77.7 304.4 79.7 308 80.8L307.3 113.8C290 116.2 276.6 130.6 275.8 148.3L234.4 153.1C230 136.8 215.4 124.7 198 123.9L193.4 80.3C196.6 79 199.5 77 201.8 74.4C204.2 71.8 205.9 68.7 206.8 65.4L292.9 65.4ZM149 441.4C151.8 441.4 154.5 442.5 156.5 444.5C158.5 446.5 159.6 449.2 159.6 452C159.6 454.8 158.5 457.5 156.5 459.5C154.5 461.5 151.8 462.6 149 462.6C146.2 462.6 143.5 461.5 141.5 459.5C139.5 457.5 138.4 454.8 138.4 452C138.4 446.1 143.1 441.4 149 441.4ZM151.1 429.8L138.3 357.3C142.8 355.1 146.4 351.6 148.6 347.2L208.3 359.6C208.3 359.7 208.3 359.8 208.3 359.9C208.3 366.4 210.3 372.4 213.7 377.3L159.8 432.5C157.1 431 154.1 430.1 151.1 429.8ZM239 378.9C228.5 378.9 220 370.4 220 359.9C220 349.5 228.5 341 239 341C249.4 341 257.9 349.5 257.9 359.9C257.9 370.4 249.4 378.9 239 378.9ZM372 331.2C366.2 331.2 361.4 326.5 361.4 320.6C361.4 314.8 366.2 310 372 310C377.9 310 382.7 314.8 382.7 320.6C382.7 326.5 377.9 331.2 372 331.2M372 298.2C367.1 298.2 362.5 299.9 358.8 302.7L333.2 282.6C337.1 275.9 339.2 268.2 339.2 260.5C339.2 256.5 338.7 252.6 337.6 248.8L373.3 233.4C377.9 239.5 385.2 243.6 393.4 243.6C397 243.6 400.3 242.8 403.4 241.5L445.8 297.9C443.5 300.8 442 304.2 441.4 307.8L392.9 312.6C389.7 304.2 381.6 298.2 372 298.2ZM80.8 145.6C88.5 145.6 95.2 141.8 99.3 135.9L157.3 156.1C156.8 158.5 156.6 161 156.6 163.4C156.6 171.3 159 178.7 163 184.9L126.9 216.9C121.5 212.7 114.9 210.4 108 210.4C95.4 210.4 84.5 218.1 79.7 229L47.5 221.6C47.3 215.8 44.8 210.5 40.9 206.6L75.4 144.9C77.2 145.3 78.9 145.6 80.8 145.6ZM269.7 359.9C269.7 350.6 265.6 342.3 259 336.6L279.2 301C284.4 303.1 289.9 304.2 295.5 304.2C307.3 304.2 318 299.5 325.9 291.8L351.4 311.9C350.2 314.7 349.6 317.6 349.6 320.6C349.6 326.4 351.9 331.7 355.5 335.6L327.3 380.1C325.2 379.5 323.1 379.1 320.8 379.1C314.2 379.1 308.4 381.9 304.3 386.5L268.5 368.3C269.3 365.6 269.7 362.8 269.7 359.9"
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
    // The other icons in this set are drawn to an 18-unit key line centred in
    // the 24 box; this one was drawn to 14.6 and sat off-centre, so it read as
    // smaller beside them. The viewBox scales and re-centres it rather than
    // redrawing the path, and the stroke is thinned by the same factor so the
    // line weight still matches.
    <svg {...base(size)} viewBox="1.56 2.94 19.49 19.49" className={className}>
      <path
        d="M4 20l4-1 10-10a2.1 2.1 0 10-3-3L5 16l-1 4z"
        stroke="currentColor"
        strokeWidth="1.30"
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

export function Phone({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <path
        d="M21 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.8 19.8 0 011.12 4.18 2 2 0 013.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L7.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0121 16.92z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
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

/* ---------------------------------------------------------------- social --
   Brand glyphs, added 2026-09-22. These are FILLED, unlike every other icon in
   this file, which is stroked. A brand mark redrawn as a 1.6px outline reads as
   an approximation of someone else's logo; the filled glyph is the mark. They
   still inherit currentColor, so they recolour with their container. */

/**
 * THE BOXED "in", per founder instruction 2026-09-23: "the proper LinkedIn icon
 * ie the 'in' in a square box". This REPLACES the bare glyph that was here.
 *
 * `fillRule="evenodd"` is load-bearing. The letters sit inside the square as
 * separate subpaths, so evenodd renders them as genuine HOLES. Filling them
 * with a colour instead would bake the background in, and this mark is used on
 * the dark footer today and could be used on a light surface tomorrow.
 *
 * NOTE FOR WHOEVER BALANCES THIS ROW NEXT. A filled square carries far more ink
 * than an open letterform at the same box, which is exactly why the founder had
 * the Facebook disc reduced to a bare f on 2026-09-22 (see below). This mark is
 * therefore sized DOWN against the others rather than matched to them; the
 * sizes in SiteFooter are set from measured ink coverage, not from the box.
 */
export function LinkedInMark({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0zM7.119 20.452H3.555V9h3.564v11.452zM5.337 7.433a2.062 2.062 0 110-4.125 2.062 2.062 0 010 4.125zm15.115 13.019h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"
      />
    </svg>
  );
}

/**
 * The BARE f, not the f-in-a-disc, per founder instruction 2026-09-22 with a
 * reference image. The disc made this the only solid shape in a row of open
 * letterforms and it dominated them.
 *
 * DERIVED FROM THE DISC PATH, NOT REDRAWN. That path went round the circle,
 * dived in to trace the f's own outline, and came back round the circle:
 *   M22 12.06 C.. S..          the circle, down to (10.44, 22)
 *   v-7.03 .. V22              the f, ending at (13.56, 22)
 *   c4.78-.76 8.44-4.92 ...z   the circle again
 * Both feet land on y=22, so dropping the two arcs and closing with `z` leaves
 * the authentic letterform. Nothing here was drawn from memory, which is what
 * the note at the top of this section forbids.
 */
export function FacebookMark({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22z"
      />
    </svg>
  );
}

/**
 * Instagram, the SOLID glyph — the founder supplied this artwork directly
 * (Downloads/Instagram.svg, 2026-09-22) and asked for it in place of the
 * outline.
 *
 * TAKEN VERBATIM, WITH ONE CHANGE: his file fills both paths #110929, a
 * near-black that would be invisible on the dark footer, so they inherit
 * currentColor like every other mark here. No path was redrawn.
 *
 * ITS DEFAULT SIZE IS 15, NOT 18, AND THAT IS DELIBERATE. Measured at a common
 * 240px box this glyph lays down 75.1% ink where the outline it replaces laid
 * down 19.7%, and its ink fills the box edge to edge (240/240 against
 * LinkedIn\'s 180). At 18 it becomes the heaviest thing in the footer by a
 * distance — the Facebook-disc problem again, four times over. 15 matches
 * LinkedIn\'s rendered ink height; rendered at 18, 16, 15 and 13 against the
 * real row before choosing.
 */
export function InstagramMark({ size = 15, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 16 16" className={className}>
      <path fill="currentColor" d="M7.99715 5.84376C7.57064 5.84263 7.15338 5.96805 6.79819 6.20416C6.44299 6.44027 6.16583 6.77645 6.00177 7.17015C5.83772 7.56385 5.79415 7.99737 5.87658 8.41584C5.95901 8.83431 6.16374 9.21892 6.46484 9.52099C6.76595 9.82306 7.14991 10.029 7.56811 10.1128C7.98632 10.1965 8.41997 10.1543 8.81419 9.99155C9.20841 9.82875 9.54547 9.55265 9.78271 9.19821C10.02 8.84377 10.1467 8.42691 10.1469 8.0004C10.1466 7.4297 9.92026 6.88236 9.51736 6.47818C9.11446 6.07399 8.56785 5.84587 7.99715 5.84376Z" />
      <path fill="currentColor" d="M15.9444 4.71177C15.9335 4.2464 15.8706 3.7837 15.7569 3.3323C15.5576 2.49115 15.1024 1.73248 14.454 1.1608C13.7744 0.572251 12.93 0.207141 12.0357 0.115054C11.5804 0.060521 11.1226 0.0292413 10.6642 0.0213372C9.75902 0.000765077 8.85842 0.000765078 7.95782 0.000765078C6.89379 0.000765078 5.82976 -0.00952097 4.76344 0.0453379C4.36007 0.0595094 3.95844 0.105366 3.56225 0.182485C2.69238 0.344459 1.89394 0.771627 1.27647 1.40538C0.646136 2.08502 0.244817 2.94521 0.129001 3.86489C0.057626 4.37953 0.0221107 4.89851 0.0227123 5.41808C0.00823564 6.26611 0.000997309 7.1149 0.000997309 7.96445C0.000997309 9.14392 -0.0127174 10.3268 0.0615707 11.5063C0.088902 12.0109 0.179519 12.51 0.331294 12.992C0.63202 13.9599 1.28445 14.7799 2.15992 15.2904C2.81706 15.6654 3.55297 15.8811 4.30856 15.9201C4.82744 15.959 5.34974 15.9841 5.8709 15.9864C7.56695 15.9967 9.26415 16.0196 10.9613 15.9647C11.4962 15.9588 12.0291 15.8998 12.5523 15.7887C13.4197 15.6063 14.2073 15.1544 14.8025 14.4976C15.3978 13.8407 15.7702 13.0126 15.8666 12.1314C15.9368 11.6167 15.9724 11.0978 15.9729 10.5783C15.9889 9.72108 15.9912 8.86391 16.0038 7.63187C15.9878 6.90499 15.9707 5.80781 15.9444 4.71177ZM7.99211 12.1052C7.18026 12.1045 6.38684 11.8631 5.71216 11.4115C5.03748 10.96 4.51183 10.3185 4.20167 9.56826C3.89151 8.818 3.81077 7.99261 3.96965 7.19646C4.12853 6.40031 4.5199 5.66914 5.09429 5.0954C5.66867 4.52165 6.40027 4.1311 7.1966 3.9731C7.99293 3.8151 8.81822 3.89676 9.56814 4.20776C10.3181 4.51875 10.9589 5.04512 11.4097 5.7203C11.8605 6.39549 12.101 7.18918 12.1008 8.00102C12.1011 8.54046 11.995 9.07465 11.7886 9.57302C11.5822 10.0714 11.2794 10.5241 10.8978 10.9054C10.5161 11.2866 10.0631 11.5888 9.56445 11.7947C9.06585 12.0006 8.53154 12.1061 7.99211 12.1052ZM12.6654 4.79063C12.3912 4.79154 12.1229 4.71104 11.8945 4.55933C11.6661 4.40763 11.4878 4.19154 11.3823 3.93845C11.2768 3.68535 11.2488 3.40663 11.3018 3.1376C11.3548 2.86857 11.4865 2.62133 11.6801 2.42719C11.8738 2.23306 12.1207 2.10077 12.3896 2.04708C12.6585 1.99339 12.9373 2.02071 13.1907 2.1256C13.444 2.23048 13.6605 2.4082 13.8128 2.63624C13.9651 2.86428 14.0462 3.13238 14.046 3.40659C14.0433 3.77181 13.897 4.1213 13.6386 4.37945C13.3802 4.6376 13.0306 4.78367 12.6654 4.78606V4.79063Z" />
    </svg>
  );
}

export function XMark({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M17.53 3h3.04l-6.64 7.59L21.75 21h-6.12l-4.79-6.26L5.35 21H2.31l7.1-8.12L2.25 3h6.27l4.33 5.72L17.53 3zm-1.07 16.17h1.69L7.62 4.73H5.81l10.65 14.44z"
      />
    </svg>
  );
}
