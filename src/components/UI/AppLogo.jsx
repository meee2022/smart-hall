// ── AppLogo — القاعة الذكية ───────────────────────────────────
// Premium SVG logo matching the Smart Hall identity
// Colors: Qatar Maroon (#4D0D19) + Gold (#C5A059)

export default function AppLogo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="القاعة الذكية"
      role="img"
    >
      {/* ── Glow filter ── */}
      <defs>
        <filter id="logo-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8C47A" />
          <stop offset="50%" stopColor="#C5A059" />
          <stop offset="100%" stopColor="#9E7A3A" />
        </linearGradient>
        <linearGradient id="maroon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6B1226" />
          <stop offset="100%" stopColor="#3A0910" />
        </linearGradient>
      </defs>

      {/* ── Outer hexagon background ── */}
      <polygon
        points="50,4 92,27 92,73 50,96 8,73 8,27"
        fill="url(#maroon-grad)"
        stroke="url(#gold-grad)"
        strokeWidth="2.5"
        filter="url(#logo-glow)"
      />

      {/* ── Inner hexagon ring ── */}
      <polygon
        points="50,12 84,31 84,69 50,88 16,69 16,31"
        fill="none"
        stroke="rgba(197,160,89,0.25)"
        strokeWidth="1"
      />

      {/* ── Hall roofline / building shape ── */}
      {/* Roof arch */}
      <path
        d="M28 58 Q50 32 72 58"
        stroke="url(#gold-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        filter="url(#logo-glow)"
      />
      {/* Left pillar */}
      <rect x="27" y="57" width="4" height="18" rx="1" fill="url(#gold-grad)" />
      {/* Right pillar */}
      <rect x="69" y="57" width="4" height="18" rx="1" fill="url(#gold-grad)" />
      {/* Floor base */}
      <rect x="24" y="73" width="52" height="3" rx="1.5" fill="url(#gold-grad)" opacity="0.8" />

      {/* ── Center door/entrance ── */}
      <rect x="44" y="60" width="12" height="16" rx="2" fill="rgba(197,160,89,0.2)" stroke="url(#gold-grad)" strokeWidth="1.5" />

      {/* ── Smart wifi / signal arcs (top center) ── */}
      <circle cx="50" cy="44" r="2.5" fill="url(#gold-grad)" filter="url(#logo-glow)" />
      <path d="M44 40 Q50 35 56 40" stroke="url(#gold-grad)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d="M40.5 36.5 Q50 28 59.5 36.5" stroke="url(#gold-grad)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />

      {/* ── Corner circuit dots ── */}
      <circle cx="50" cy="8" r="2" fill="#C5A059" opacity="0.6" />
      <circle cx="87" cy="29" r="1.5" fill="#C5A059" opacity="0.4" />
      <circle cx="87" cy="71" r="1.5" fill="#C5A059" opacity="0.4" />
      <circle cx="50" cy="92" r="2" fill="#C5A059" opacity="0.6" />
      <circle cx="13" cy="71" r="1.5" fill="#C5A059" opacity="0.4" />
      <circle cx="13" cy="29" r="1.5" fill="#C5A059" opacity="0.4" />
    </svg>
  )
}
