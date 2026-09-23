'use client';

export default function TrustBadge({ Icon, title, compact = false }) {
  if (compact) {
    return (
      <div className="flex flex-col items-center gap-1.5 shrink-0 w-[70px]">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #252D5C 0%, #1A2040 100%)', border: '1.5px solid rgba(113,134,250,0.45)', boxShadow: '0 0 10px rgba(113,134,250,0.12)' }}>
          <Icon size={16} color="#7186FA" strokeWidth={1.6} />
        </div>
        <p className="text-white text-[10px] font-[family-name:var(--font-figtree)] font-[500] leading-[13px] text-center break-words w-full">
          {title}
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <div className="w-[52px] h-[52px] rounded-xl shrink-0 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #252D5C 0%, #1A2040 100%)', border: '1.5px solid rgba(113,134,250,0.45)', boxShadow: '0 0 12px rgba(113,134,250,0.15)' }}>
        <Icon size={22} color="#7186FA" strokeWidth={1.6} />
      </div>
      <p className="text-white text-[14px] font-[family-name:var(--font-figtree)] font-[500] leading-[20px]">
        {title}
      </p>
    </div>
  );
}
