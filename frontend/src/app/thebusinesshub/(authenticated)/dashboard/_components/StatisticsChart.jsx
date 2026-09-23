'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getEnquiryDashboardStats } from "@/api/enquiry";

const ACCENT       = '#474972';
const ACCENT_MID   = '#6366f1';
const ACCENT_LIGHT = '#7c7fce';

const ENQUIRY_TYPES = [
  { value: 'all',              label: 'All Enquiries'    },
  { value: 'contact',          label: 'Contact Enquiry'  },
  { value: 'post-requirement', label: 'Post Requirement' },
  { value: 'general',          label: 'General Enquiry'  },
  { value: 'job-application',  label: 'Job Application'  },
];

// Rounded-top bar path — flat bottom, rounded top corners
const roundedTopBar = (x, y, w, h, r = 6) => {
  if (h <= 0) return '';
  r = Math.min(r, h / 2, w / 2);
  return (
    `M ${x},${y + r}` +
    ` a ${r},${r} 0 0 1 ${r},${-r}` +
    ` L ${x + w - r},${y}` +
    ` a ${r},${r} 0 0 1 ${r},${r}` +
    ` L ${x + w},${y + h}` +
    ` L ${x},${y + h} Z`
  );
};

const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const fmt = (v) => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(v);

// ── Animated Bar Chart ─────────────────────────────────────────
function BarChart({ data, dataKey, height = 230 }) {
  const [animP, setAnimP]     = useState(0);
  const [hovered, setHovered] = useState(null);
  const rafRef  = useRef(null);
  const startRef = useRef(null);
  const DURATION = 900;

  // Reset + replay animation whenever data changes
  useEffect(() => {
    setAnimP(0);
    setHovered(null);
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const id = setTimeout(() => {
      const tick = (ts) => {
        if (!startRef.current) startRef.current = ts;
        const t = Math.min((ts - startRef.current) / DURATION, 1);
        setAnimP(t);
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, 40);

    return () => {
      clearTimeout(id);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey]);

  const getBarP = (i) => {
    const N = data.length;
    const stagger = 0.38;
    const start = N > 1 ? (i / (N - 1)) * stagger : 0;
    return easeOut(Math.max(0, Math.min(1, (animP - start) / (1 - stagger))));
  };

  if (!data || data.length === 0) return null;

  const W = 520, H = height;
  const PL = 46, PR = 16, PT = 30, PB = 30;
  const iW = W - PL - PR, iH = H - PT - PB;
  const N = data.length;

  const maxV   = Math.max(...data.map((d) => d.val), 1);
  const avg    = data.reduce((s, d) => s + d.val, 0) / N;
  const ay     = PT + iH - (avg / maxV) * iH;
  const peakI  = data.reduce((bi, d, i, arr) => d.val > arr[bi].val ? i : bi, 0);

  const slotW  = iW / N;
  const barW   = Math.max(Math.min(slotW * 0.62, 54), 10);
  const barOff = (slotW - barW) / 2;
  const yTicks = [0, Math.round(maxV / 3), Math.round((maxV * 2) / 3), maxV];

  const gradId      = 'bch-grad';
  const gradHoverId = 'bch-grad-h';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={ACCENT}       stopOpacity="1"    />
          <stop offset="100%" stopColor={ACCENT_LIGHT}  stopOpacity="0.7"  />
        </linearGradient>
        <linearGradient id={gradHoverId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={ACCENT_MID}   stopOpacity="1"    />
          <stop offset="100%" stopColor="#a78bfa"       stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Grid lines + y-labels */}
      {yTicks.map((t, i) => {
        const y = PT + iH - (t / maxV) * iH;
        return (
          <g key={i}>
            <line x1={PL} x2={W - PR} y1={y} y2={y} stroke="#E8EAF4" strokeWidth="1" strokeDasharray="4 5" />
            <text x={PL - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#b0b3cc">{fmt(t)}</text>
          </g>
        );
      })}

      {/* Average line */}
      <line x1={PL} x2={W - PR} y1={ay} y2={ay} stroke={ACCENT} strokeWidth="1" strokeDasharray="6 5" opacity="0.35" />
      <rect x={PL + 6} y={ay - 8} width={64} height={13} rx={3} fill={ACCENT + '14'} />
      <text x={PL + 10} y={ay + 1} fontSize="7.5" fill={ACCENT} fontWeight="600" opacity="0.65">Avg line</text>

      {/* Bars */}
      {data.map((d, i) => {
        const prog  = getBarP(i);
        const fullH = (d.val / maxV) * iH;
        const animH = fullH * prog;
        const x     = PL + i * slotW + barOff;
        const y     = PT + iH - animH;
        const isH   = hovered === i;
        const isPk  = i === peakI;

        return (
          <g key={i}>
            {/* Soft shadow */}
            {animH > 3 && (
              <path
                d={roundedTopBar(x + 2, y + 4, barW, animH, 5)}
                fill="rgba(71,73,114,0.10)"
              />
            )}
            {/* Bar */}
            {animH > 0 && (
              <path
                d={roundedTopBar(x, y, barW, animH, 5)}
                fill={isH ? `url(#${gradHoverId})` : `url(#${gradId})`}
                opacity={isPk ? 1 : isH ? 1 : 0.78}
                style={{ transition: 'opacity 0.15s' }}
              />
            )}
            {/* Invisible hover strip */}
            <rect
              x={PL + i * slotW} y={PT}
              width={slotW} height={iH}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          </g>
        );
      })}

      {/* Peak callout — fades in after peak bar reaches 65% height */}
      {(() => {
        const prog = getBarP(peakI);
        if (prog < 0.65 || data[peakI].val === 0) return null;
        const animH = (data[peakI].val / maxV) * iH * prog;
        const cx    = PL + peakI * slotW + barOff + barW / 2;
        const topY  = PT + iH - animH;
        const cy    = Math.max(topY - 20, PT - 2);
        const tw    = 46;
        const opacity = Math.min(1, (prog - 0.65) / 0.2);
        return (
          <g style={{ pointerEvents: 'none', opacity }}>
            <rect x={cx - tw / 2} y={cy} width={tw} height={17} rx={5} fill={ACCENT} />
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">
              {fmt(data[peakI].val)}
            </text>
            <line x1={cx} y1={cy + 17} x2={cx} y2={topY} stroke={ACCENT} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
          </g>
        );
      })()}

      {/* Hover tooltip */}
      {hovered !== null && (() => {
        const d    = data[hovered];
        if (!d) return null;
        const prog = getBarP(hovered);
        const animH = (d.val / maxV) * iH * prog;
        const cx    = PL + hovered * slotW + barOff + barW / 2;
        const topY  = PT + iH - animH;
        const tw = 72, th = 44;
        const tx = Math.min(Math.max(cx - tw / 2, PL), W - PR - tw);
        const ty = Math.max(topY - th - 14, PT);
        return (
          <g style={{ pointerEvents: 'none' }}>
            <line x1={cx} x2={cx} y1={PT} y2={topY} stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.22" />
            {/* Shadow */}
            <rect x={tx + 1} y={ty + 2} width={tw} height={th} rx={8} fill="rgba(0,0,0,0.15)" />
            {/* Box */}
            <rect x={tx} y={ty} width={tw} height={th} rx={8} fill="#252747" />
            <rect x={tx} y={ty} width={tw} height={5}  rx={4} fill={ACCENT} />
            {/* Arrow */}
            <polygon points={`${cx - 6},${ty + th} ${cx + 6},${ty + th} ${cx},${ty + th + 7}`} fill="#252747" />
            {/* Value */}
            <text x={tx + tw / 2} y={ty + 24} textAnchor="middle" fontSize="15" fill="#fff" fontWeight="800" style={{ letterSpacing: '-0.3px' }}>
              {fmt(d.val)}
            </text>
            {/* Month */}
            <text x={tx + tw / 2} y={ty + 37} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)" fontWeight="500">
              {d.month}
            </text>
          </g>
        );
      })()}

      {/* X-axis labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={PL + i * slotW + slotW / 2}
          y={H - 5}
          textAnchor="middle"
          fontSize="9.5"
          fill={hovered === i ? ACCENT : '#b0b3cc'}
          fontWeight={hovered === i ? '700' : '500'}
        >
          {d.month}
        </text>
      ))}
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function StatisticsChart() {
  const [period,            setPeriod]            = useState('monthly');
  const [enquiryType,       setEnquiryType]       = useState('all');
  const [dropdownOpen,      setDropdownOpen]      = useState(false);
  const [startDate,         setStartDate]         = useState('');
  const [endDate,           setEndDate]           = useState('');
  const [chartData,         setChartData]         = useState(null);
  const [loading,           setLoading]           = useState(true);
  const [customDateApplied, setCustomDateApplied] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchData = useCallback(async (periodToUse = period) => {
    setLoading(true);
    try {
      const yr = new Date().getFullYear();
      const reqStart = periodToUse === 'monthly' ? `${yr}-01-01` : startDate;
      const reqEnd   = periodToUse === 'monthly' ? `${yr}-12-31` : endDate;
      const res = await getEnquiryDashboardStats({
        type: enquiryType, period: periodToUse, startDate: reqStart, endDate: reqEnd,
      });
      setChartData(res);
    } catch {
      setChartData(null);
    } finally {
      setLoading(false);
    }
  }, [period, enquiryType, startDate, endDate]);

  useEffect(() => {
    if (period !== 'custom' || customDateApplied) fetchData(period);
  }, [period, enquiryType, customDateApplied, fetchData]);

  const handlePeriodChange = (p) => {
    setPeriod(p);
    setCustomDateApplied(false);
    if (p !== 'custom') { setStartDate(''); setEndDate(''); }
  };

  const handleApply = () => {
    if (!startDate || !endDate) { alert('Please select both dates'); return; }
    if (new Date(startDate) > new Date(endDate)) { alert('Start must be before end'); return; }
    setCustomDateApplied(true);
  };

  // Build chart data — for monthly view, cap at current month
  const svgData = useMemo(() => {
    if (!chartData?.labels?.length) return [];
    const vals = chartData.datasets?.[0]?.data ?? [];
    const all  = chartData.labels.map((label, i) => ({
      month: String(label).slice(0, 3),
      val:   Number(vals[i] ?? 0),
    }));
    if (period === 'monthly') {
      const currentMonthIdx = new Date().getMonth(); // 0=Jan … 11=Dec
      return all.slice(0, currentMonthIdx + 1);
    }
    return all;
  }, [chartData, period]);

  // Stable key to trigger animation replay on any filter change
  const dataKey = useMemo(
    () => svgData.map((d) => `${d.month}:${d.val}`).join(','),
    [svgData]
  );

  return (
    <div className="flex flex-col h-full">
      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Period pills */}
        <div className="flex gap-1.5">
          {['monthly', 'custom'].map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all duration-150 ${
                period === p
                  ? 'bg-[#474972] text-white border-[#474972]'
                  : 'bg-white border-[#dddfee] hover:border-[#474972]'
              }`}
              style={{ color: period === p ? '#fff' : '#6e6f8a' }}
            >
              {p === 'custom' ? 'Custom Date' : 'Monthly'}
            </button>
          ))}
        </div>

        {/* Enquiry type dropdown */}
        <div ref={dropdownRef} className="relative" style={{ minWidth: 180 }}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-full h-9 flex items-center justify-between px-3 rounded-lg border border-[#dddfee] bg-white text-[12px] font-medium hover:border-[#474972] transition-colors duration-150"
            style={{ color: '#40415D' }}
          >
            {ENQUIRY_TYPES.find((t) => t.value === enquiryType)?.label || 'All Enquiries'}
            <span className="ml-2 text-[9px]" style={{ color: '#9a9bb8' }}>▼</span>
          </button>
          {dropdownOpen && (
            <ul className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-[#dddfee] rounded-lg shadow-md py-1 list-none m-0 p-0">
              {ENQUIRY_TYPES.map((type) => (
                <li
                  key={type.value}
                  onClick={() => { setEnquiryType(type.value); setDropdownOpen(false); }}
                  className={`px-3 py-2 text-[12px] cursor-pointer transition-colors duration-100 ${
                    enquiryType === type.value ? '' : 'hover:bg-[#f4f3fb]'
                  }`}
                  style={{
                    background: enquiryType === type.value ? '#474972' : undefined,
                    color:      enquiryType === type.value ? '#fff'    : '#40415D',
                  }}
                >
                  {type.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Current year badge — monthly only */}
        {period === 'monthly' && (
          <span className="ml-auto text-[11px] font-semibold px-2.5 py-1 rounded-lg"
            style={{ background: '#474972' + '12', color: '#474972' }}>
            {new Date().getFullYear()} · Jan – {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][new Date().getMonth()]}
          </span>
        )}
      </div>

      {/* Custom date inputs */}
      {period === 'custom' && (
        <div className="flex flex-wrap items-end gap-3 mb-4">
          <div>
            <label className="block text-[11px] font-semibold mb-1" style={{ color: '#6e6f8a' }}>Start Date</label>
            <input
              type="date" value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 px-3 rounded-lg border border-[#dddfee] text-[12px] outline-none focus:border-[#474972] transition-colors"
              style={{ color: '#40415D' }}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold mb-1" style={{ color: '#6e6f8a' }}>End Date</label>
            <input
              type="date" value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="h-9 px-3 rounded-lg border border-[#dddfee] text-[12px] outline-none focus:border-[#474972] transition-colors"
              style={{ color: '#40415D' }}
            />
          </div>
          <button
            onClick={handleApply}
            disabled={!startDate || !endDate}
            className="h-9 px-4 rounded-lg text-white text-[12px] font-semibold disabled:opacity-40 transition-colors duration-150"
            style={{ background: '#474972' }}
          >
            Apply
          </button>
        </div>
      )}

      {/* ── Chart ── */}
      <div className="flex-1 min-h-[200px] overflow-x-hidden w-full flex flex-col justify-center">
        {loading ? (
          <div className="flex items-center justify-center" style={{ height: 200 }}>
            <div
              className="w-6 h-6 rounded-full border-2 animate-spin"
              style={{ borderColor: '#474972', borderTopColor: 'transparent' }}
            />
          </div>
        ) : svgData.length > 0 ? (
          <BarChart data={svgData} dataKey={dataKey} height={230} />
        ) : (
          <div className="flex items-center justify-center" style={{ height: 200, color: '#9a9bb8', fontSize: 13 }}>
            No enquiry data for the selected period
          </div>
        )}
      </div>
    </div>
  );
}
