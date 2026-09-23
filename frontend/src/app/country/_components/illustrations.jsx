// Custom SVG illustrations — palette-restricted, 3D-feeling via gradients + layered shadows

// Cinematic palette
const ink950 = "#18193e";
const ink900 = "#1e1f3d";
const ink800 = "#3a3c63";
const ink700 = "#3a3c60";
const soft100 = "#eceafd";
const soft200 = "#eae9f6";
const soft300 = "#ebe9f8";
const soft400 = "#dddaf4";

export function RealEstateEcosystem({ fill = false }) {
  return (
    <svg
      viewBox="0 0 560 520"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={
        fill
          ? { width: "100%", height: "100%", display: "block" }
          : { width: "100%", height: "auto", display: "block" }
      }
    >
      <defs>
        <linearGradient id="sbc-towerA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={soft400} />
          <stop offset="1" stopColor={ink800} />
        </linearGradient>
        <linearGradient id="sbc-towerB" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor={soft400} />
        </linearGradient>
        <linearGradient id="sbc-towerC" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={ink900} />
          <stop offset="1" stopColor={ink800} />
        </linearGradient>
        <linearGradient id="sbc-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={soft200} />
          <stop offset="1" stopColor={soft400} />
        </linearGradient>
        <radialGradient id="sbc-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={soft100} stopOpacity="0.7" />
          <stop offset="1" stopColor={soft100} stopOpacity="0" />
        </radialGradient>
        <pattern id="sbc-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke={ink800} strokeOpacity="0.08" />
        </pattern>
      </defs>

      <circle cx="430" cy="120" r="140" fill="url(#sbc-glow)" />

      <g transform="translate(280 350)">
        <polygon points="0,-110 240,10 0,130 -240,10" fill="url(#sbc-ground)" />
        <polygon points="0,-110 240,10 0,130 -240,10" fill="url(#sbc-grid)" />
        <polygon points="-240,10 0,130 0,150 -240,30" fill={ink800} opacity="0.35" />
        <polygon points="240,10 0,130 0,150 240,30" fill={ink900} opacity="0.45" />
      </g>

      <g transform="translate(232 92)">
        <polygon points="0,0 80,40 80,210 0,170" fill="url(#sbc-towerA)" />
        <polygon points="80,40 110,25 110,195 80,210" fill={ink900} />
        <polygon points="0,0 30,-15 110,25 80,40" fill={soft300} />
        {Array.from({ length: 8 }).map((_, r) => (
          <g key={r}>
            <rect x="10" y={20 + r * 18} width="8" height="10" fill={soft100} opacity="0.85" />
            <rect x="26" y={28 + r * 18} width="8" height="10" fill={soft100} opacity="0.7" />
            <rect x="42" y={36 + r * 18} width="8" height="10" fill={soft100} opacity="0.55" />
            <rect x="58" y={44 + r * 18} width="8" height="10" fill={soft100} opacity="0.4" />
          </g>
        ))}
      </g>

      <g transform="translate(160 180)">
        <polygon points="0,0 70,35 70,170 0,135" fill="url(#sbc-towerB)" />
        <polygon points="70,35 96,22 96,157 70,170" fill={soft400} />
        <polygon points="0,0 26,-13 96,22 70,35" fill="#fff" />
        {Array.from({ length: 6 }).map((_, r) => (
          <g key={r}>
            <rect x="8" y={14 + r * 18} width="10" height="11" fill={ink800} opacity="0.5" />
            <rect x="26" y={23 + r * 18} width="10" height="11" fill={ink800} opacity="0.4" />
            <rect x="44" y={32 + r * 18} width="10" height="11" fill={ink800} opacity="0.32" />
          </g>
        ))}
      </g>

      <g transform="translate(310 220)">
        <polygon points="0,0 70,35 70,150 0,115" fill="url(#sbc-towerC)" />
        <polygon points="70,35 96,22 96,137 70,150" fill={ink950} />
        <polygon points="0,0 26,-13 96,22 70,35" fill={ink800} />
        {Array.from({ length: 5 }).map((_, r) => (
          <g key={r}>
            <rect x="8" y={14 + r * 18} width="9" height="10" fill={soft100} opacity="0.85" />
            <rect x="24" y={23 + r * 18} width="9" height="10" fill={soft100} opacity="0.6" />
            <rect x="40" y={32 + r * 18} width="9" height="10" fill={soft100} opacity="0.4" />
            <rect x="56" y={41 + r * 18} width="9" height="10" fill={soft100} opacity="0.25" />
          </g>
        ))}
      </g>

      <g transform="translate(95 320)">
        <polygon points="0,0 50,25 50,70 0,45" fill={soft300} />
        <polygon points="50,25 70,15 70,60 50,70" fill={soft400} />
        <polygon points="0,0 20,-10 70,15 50,25" fill="#fff" />
        <rect x="10" y="20" width="8" height="10" fill={ink800} opacity="0.5" />
        <rect x="26" y="28" width="8" height="10" fill={ink800} opacity="0.4" />
      </g>

      {[
        { x: 90, y: 110, r: 16, label: "AI" },
        { x: 470, y: 90, r: 14, label: "IoT" },
        { x: 495, y: 240, r: 18, label: "API" },
        { x: 60, y: 240, r: 14, label: "DB" },
        { x: 430, y: 360, r: 14, label: "5G" },
      ].map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r + 8} fill={soft100} opacity="0.5" />
          <circle cx={n.x} cy={n.y} r={n.r} fill="#fff" stroke={ink800} strokeWidth="1" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontFamily="var(--font-figtree), sans-serif" fontSize="10" fontWeight="600" fill={ink950}>{n.label}</text>
        </g>
      ))}

      <g stroke={ink800} strokeOpacity="0.35" strokeDasharray="3 4" fill="none">
        <path d="M90 110 Q 200 160 272 130" />
        <path d="M470 90 Q 380 160 320 220" />
        <path d="M495 240 Q 420 280 380 300" />
        <path d="M60 240 Q 130 250 195 215" />
        <path d="M430 360 Q 380 320 350 300" />
      </g>

      <g transform="translate(380 60)">
        <rect x="0" y="0" width="120" height="58" rx="10" fill="#fff" stroke={soft400} />
        <text x="12" y="18" fontFamily="var(--font-figtree)" fontSize="9" fontWeight="600" fill={ink700}>OCCUPANCY</text>
        <text x="12" y="38" fontFamily="var(--font-figtree)" fontSize="22" fontWeight="700" fill={ink950}>94.2%</text>
        <polyline points="68,40 78,32 86,36 94,28 102,32 110,22" fill="none" stroke={ink800} strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function TechLogo({ name, mono }) {
  const color = mono ? ink800 : ink950;
  return (
    <div
      className="flex items-center gap-2.5"
      style={{ fontFamily: "var(--font-figtree), system-ui, sans-serif", fontWeight: 700, color, letterSpacing: "-0.02em", fontSize: 22 }}
    >
      <span
        style={{
          width: 34, height: 34, borderRadius: 8,
          background: mono ? soft400 : ink900,
          color: mono ? ink900 : "#fff",
          display: "grid", placeItems: "center",
          fontSize: 14, fontWeight: 800,
        }}
      >
        {name[0]}
      </span>
      <span>{name}</span>
    </div>
  );
}
