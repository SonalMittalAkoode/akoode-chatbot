"use client";

const SBC_HERO_STATS = [
  { v: "240+", l: "Gurugram & NCR projects", sub: "Built locally, shipped globally" },
  { v: "94%", l: "Client retention", sub: "Year-on-year, since 2019" },
  { v: "₹420Cr", l: "Revenue impact (FY24)", sub: "Across our top-30 clients" },
];

function StatsBarInner({ extraClass = "", compact = false }) {
  const shell = compact
    ? "rounded-[5px] py-2 sm:py-2.5 px-0 border border-[rgba(180,160,255,0.22)] w-full max-w-none"
    : "rounded-[5px] py-7 sm:pt-[44px] sm:pb-[44px] px-3 sm:px-[56px] border border-[rgba(180,160,255,0.25)] w-full";
  const shadow = compact
    ? "0 16px 40px -18px rgba(60,63,120,0.28), 0 2px 0 rgba(80,60,200,0.06), inset 0 1px 0 rgba(255,255,255,0.65)"
    : "0 30px 80px -20px rgba(60,63,120,0.38), 0 4px 0 rgba(80,60,200,0.08), inset 0 1px 0 rgba(255,255,255,0.7)";
  const cellPad = compact ? "py-0.5 px-3 sm:px-4" : "py-1 px-2 sm:px-7";
  const valueCls = compact
    ? "text-[1.125rem] sm:text-[1.5rem] md:text-[1.625rem] leading-none font-bold tracking-[-0.03em]"
    : "text-[22px] sm:text-[42px] leading-none font-bold tracking-[-0.04em]";
  const labelCls = compact
    ? "text-[0.625rem] sm:text-[0.8125rem] font-semibold tracking-[-0.01em] mt-0.5 sm:mt-1 text-[#18193e] leading-snug"
    : "text-[11px] sm:text-[17px] font-semibold tracking-[-0.012em] mt-2 sm:mt-[14px] text-[#18193e] leading-snug";
  const subCls = compact
    ? "text-[0.5625rem] sm:text-[0.6875rem] mt-0.5 text-[#2a2d52] leading-snug"
    : "text-[9px] sm:text-[14px] mt-0.5 sm:mt-1.5 text-[#2a2d52] leading-snug";

  const cellMin = compact
    ? "min-w-[11rem] sm:min-w-[13rem] md:min-w-[14rem]"
    : "min-w-[240px] sm:min-w-[280px]";

  const statCell = (s, i, key) => (
    <div
      key={key}
      className={`flex-shrink-0 ${cellMin} ${cellPad}${i > 0 ? " border-l border-l-[rgba(60,63,106,0.12)]" : ""}`}
    >
      <div
        className={valueCls}
        style={{
          fontFamily: "var(--font-figtree), system-ui, sans-serif",
          background: "linear-gradient(135deg, #18193e 0%, #3a3c80 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {s.v}
      </div>
      <div className={labelCls}>{s.l}</div>
      <div className={subCls}>{s.sub}</div>
    </div>
  );

  if (compact) {
    const loop = [...SBC_HERO_STATS, ...SBC_HERO_STATS];
    return (
      <div
        className={`reveal ${shell} overflow-hidden ${extraClass}`.trim()}
        style={{
          background: "linear-gradient(135deg, #f4f2ff 0%, #eceafd 35%, #e8e5fb 60%, #ede9fc 100%)",
          boxShadow: shadow,
        }}
      >
        <div className="sbc-stats-marquee-wrap py-0.5">
          <div className="sbc-stats-marquee-track">{loop.map((s, i) => statCell(s, i, `${s.v}-${i}`))}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`reveal grid grid-cols-3 ${shell} ${extraClass}`.trim()}
      style={{
        background: "linear-gradient(135deg, #f4f2ff 0%, #eceafd 35%, #e8e5fb 60%, #ede9fc 100%)",
        boxShadow: shadow,
      }}
    >
      {SBC_HERO_STATS.map((s, i) => statCell(s, i, String(i)))}
    </div>
  );
}

export function StatsBar({ embedded = false }) {
  if (embedded) {
    return <StatsBarInner extraClass="in" compact />;
  }
  return (
    <div className="sbc-container sbc-statsbar-float" style={{ position: "relative", zIndex: 5 }}>
      <StatsBarInner />
    </div>
  );
}
