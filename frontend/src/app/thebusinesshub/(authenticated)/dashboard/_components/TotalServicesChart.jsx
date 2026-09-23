'use client'

import { useState, useEffect, useMemo } from 'react';
import { getEnquiryDashboardCount } from "@/api/enquiry";

// ── Colour palette ─────────────────────────────────────────────
const CONFIG = [
  { key: 'contact',         label: 'Contact Enquiry',  color: '#474972', side: '#1e2040', lite: '#7c7fce' },
  { key: 'postRequirement', label: 'Post Requirement',  color: '#6366f1', side: '#3438b8', lite: '#a5b4fc' },
  { key: 'general',         label: 'General Enquiry',   color: '#a78bfa', side: '#7048d8', lite: '#ddd6fe' },
  { key: 'jobApplication',  label: 'Job Application',   color: '#22c55e', side: '#15803d', lite: '#86efac' },
];

// ── Maths helpers ──────────────────────────────────────────────
const rad   = (d) => (d * Math.PI) / 180;
const px    = (cx, rx, a) => cx + rx * Math.cos(rad(a));
const py    = (cy, ry, a) => cy + ry * Math.sin(rad(a));

function topFace(cx, cy, rx, ry, s, e) {
  const span  = e - s;
  const large = span > 180 ? 1 : 0;
  return (
    `M ${cx} ${cy}` +
    ` L ${px(cx, rx, s)} ${py(cy, ry, s)}` +
    ` A ${rx} ${ry} 0 ${large} 1 ${px(cx, rx, e)} ${py(cy, ry, e)}` +
    ` Z`
  );
}

function sideWall(cx, cy, rx, ry, s, e, depth) {
  const span  = e - s;
  const large = span > 180 ? 1 : 0;
  const x1 = px(cx, rx, s), y1 = py(cy, ry, s);
  const x2 = px(cx, rx, e), y2 = py(cy, ry, e);
  return (
    `M ${x1} ${y1}` +
    ` A ${rx} ${ry} 0 ${large} 1 ${x2} ${y2}` +
    ` L ${x2} ${y2 + depth}` +
    ` A ${rx} ${ry} 0 ${large} 0 ${x1} ${y1 + depth}` +
    ` Z`
  );
}

// ── 3D Pie SVG ─────────────────────────────────────────────────
function Pie3D({ segs, W, H, cx, cy, RX, RY, depth, explode }) {
  const [hovered, setHovered] = useState(null);

  // Back → front (smallest sin = furthest back)
  const sorted = useMemo(
    () => [...segs].sort((a, b) => Math.sin(rad(a.mid)) - Math.sin(rad(b.mid))),
    [segs]
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      <defs>
        {/* Per-segment radial highlight (lighting from top-left) */}
        {CONFIG.map((c) => (
          <radialGradient key={c.key} id={`rg-${c.key}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="#fff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0"    />
          </radialGradient>
        ))}
        <filter id="pie-shadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="rgba(71,73,114,0.28)" />
        </filter>
      </defs>

      {/* ── Side walls (back → front) ─────────────── */}
      {sorted.map((seg) => {
        if (seg.pct < 0.005) return null;
        const isH = hovered === seg.key;
        const ex  = (explode + (isH ? 4 : 0)) * Math.cos(rad(seg.mid));
        const ey  = (explode + (isH ? 4 : 0)) * Math.sin(rad(seg.mid));
        return (
          <path
            key={`sw-${seg.key}`}
            d={sideWall(cx + ex, cy + ey, RX, RY, seg.s, seg.e, depth)}
            fill={seg.side}
            style={{ transition: 'all 0.2s' }}
          />
        );
      })}

      {/* ── Top faces (back → front) ──────────────── */}
      {sorted.map((seg) => {
        if (seg.pct < 0.005) return null;
        const isH = hovered === seg.key;
        const ex  = (explode + (isH ? 4 : 0)) * Math.cos(rad(seg.mid));
        const ey  = (explode + (isH ? 4 : 0)) * Math.sin(rad(seg.mid));
        const d   = topFace(cx + ex, cy + ey, RX, RY, seg.s, seg.e);
        return (
          <g key={`tf-${seg.key}`} style={{ transition: 'all 0.2s' }}>
            <path d={d} fill={seg.color} filter="url(#pie-shadow)" />
            {/* Gloss highlight */}
            <path d={d} fill={`url(#rg-${seg.key})`} />
            {/* Invisible hover area */}
            <path
              d={d}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(seg.key)}
              onMouseLeave={() => setHovered(null)}
            />
          </g>
        );
      })}

      {/* ── Floating labels ───────────────────────── */}
      {segs.map((seg) => {
        if (seg.pct < 0.03) return null;
        const ex   = explode * Math.cos(rad(seg.mid));
        const ey   = explode * Math.sin(rad(seg.mid));
        // Line start: just outside segment edge
        const lx0  = px(cx + ex, RX + 7, seg.mid);
        const ly0  = py(cy + ey, RY + 7, seg.mid);
        // Label centre: circular distance (consistent spacing)
        const LDIST = RX + 62;
        const lx1   = cx + LDIST * Math.cos(rad(seg.mid));
        const ly1   = cy + LDIST * Math.sin(rad(seg.mid)) * (RY / RX);
        const isR   = Math.cos(rad(seg.mid)) >= 0;
        const PW    = 82, PH = 20;
        const pillX = isR ? lx1 + 2 : lx1 - PW - 2;
        const lineTx = isR ? pillX : pillX + PW;
        const isH   = hovered === seg.key;

        return (
          <g key={`lbl-${seg.key}`}>
            {/* Dashed connector */}
            <line
              x1={lx0} y1={ly0} x2={lineTx} y2={ly1}
              stroke={seg.color} strokeWidth="1.5"
              strokeDasharray="3 3" opacity={isH ? 1 : 0.75}
            />
            {/* Pill */}
            <rect
              x={pillX} y={ly1 - PH / 2}
              width={PW} height={PH} rx={10}
              fill={seg.color} opacity={isH ? 0.25 : 0.13}
            />
            <rect
              x={pillX} y={ly1 - PH / 2}
              width={PW} height={PH} rx={10}
              fill="none" stroke={seg.color}
              strokeWidth="1" opacity={isH ? 0.9 : 0.5}
            />
            <text
              x={pillX + PW / 2} y={ly1 + 4.5}
              textAnchor="middle"
              fontSize="8" fill={seg.color} fontWeight="700"
            >
              {seg.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Main export ────────────────────────────────────────────────
export default function TotalServicesChart() {
  const [counts,  setCounts]  = useState({ contact: 0, postRequirement: 0, general: 0, jobApplication: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [c, p, g, j] = await Promise.all([
          getEnquiryDashboardCount('contact'),
          getEnquiryDashboardCount('post-requirement'),
          getEnquiryDashboardCount('general'),
          getEnquiryDashboardCount('job-application'),
        ]);
        setCounts({ contact: c, postRequirement: p, general: g, jobApplication: j });
      } catch {/* keep zeros */} finally { setLoading(false); }
    })();
  }, []);

  const total = Object.values(counts).reduce((s, v) => s + v, 0);

  const segs = useMemo(() => {
    let cum = -90;
    return CONFIG.map((cfg) => {
      const val  = counts[cfg.key] || 0;
      const pct  = total > 0 ? val / total : 0;
      const span = pct * 360;
      const s = cum, e = cum + span, mid = cum + span / 2;
      cum = e;
      return { ...cfg, val, pct, s, e, mid };
    });
  }, [counts, total]);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#dddfee]/60 flex flex-col">
      {/* Header */}
      <div className="mb-2 shrink-0">
        <h4 className="text-[15px] font-bold m-0 leading-tight" style={{ color: '#40415D' }}>
          Quick Enquiry View
        </h4>
        <p className="text-[11px] mt-0.5 mb-0" style={{ color: '#9a9bb8' }}>By category</p>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 animate-spin"
            style={{ borderColor: '#474972', borderTopColor: 'transparent' }} />
        </div>
      ) : total === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[13px]" style={{ color: '#9a9bb8' }}>
          No enquiry data yet
        </div>
      ) : (
        <>
          {/* 3D Pie */}
          <div className="flex items-center justify-center">
            <Pie3D
              segs={segs}
              W={390} H={160}
              cx={180} cy={85}
              RX={75} RY={42}
              depth={18}
              explode={8}
            />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3 shrink-0 border-t border-[#f0f0f8] pt-3">
            {CONFIG.map((c) => (
              <div key={c.key} className="flex items-center gap-1.5 min-w-0">
                <div className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ background: c.color }} />
                <span className="text-[10.5px] font-medium truncate" style={{ color: '#6e6f8a' }}>
                  {c.label}
                </span>
                <span className="ml-auto text-[10.5px] font-bold shrink-0" style={{ color: '#40415D' }}>
                  {counts[c.key]}
                </span>
              </div>
            ))}
            {/* Total row */}
            <div className="col-span-2 flex items-center justify-between pt-1 mt-0.5 border-t border-[#f0f0f8]">
              <span className="text-[11px] font-semibold" style={{ color: '#9a9bb8' }}>Total</span>
              <span className="text-[13px] font-extrabold" style={{ color: '#40415D' }}>{total}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
