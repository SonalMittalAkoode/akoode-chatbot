'use client'

import { useMemo, useState, useEffect } from 'react';
import {
  FiGrid, FiFileText, FiGlobe, FiBriefcase,
  FiBarChart2, FiExternalLink, FiPlusCircle,
} from 'react-icons/fi';
import { getServicesTableData } from '@/api/services';

const ACCENT   = '#474972';
const CS_COLOR = '#a78bfa';
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildMonthlyCounts(list, year) {
  const counts = {};
  list.forEach(item => {
    if (!item.createdAt) return;
    const d = new Date(item.createdAt);
    if (d.getFullYear() !== year) return;
    const m = d.getMonth();
    counts[m] = (counts[m] || 0) + 1;
  });
  return counts;
}

// ── Stat Card ────────────────────────────────────────────────
function StatCard({ Icon, label, value, sublabel, gradient, border, iconBg }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col h-full group ${gradient} ${border}`}>
      {/* Faded bg icon */}
      <Icon
        size={88}
        className="absolute -bottom-3 -right-3 pointer-events-none select-none transition-transform duration-300 group-hover:scale-110"
        style={{ color: iconBg, opacity: 0.08 }}
      />
      {/* Colored icon box */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm"
        style={{ background: iconBg }}
      >
        <Icon size={18} color="#fff" />
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#6e6f8a' }}>
        {label}
      </div>
      <div className="text-[36px] font-extrabold leading-none mb-1" style={{ color: '#40415D' }}>
        {value}
      </div>
      <div className="text-[11px]" style={{ color: '#9a9bb8' }}>{sublabel}</div>
    </div>
  );
}

// ── Dual-series SVG area chart ────────────────────────────────
function DualAreaChart({ blogData, csData }) {
  const [tooltip, setTooltip] = useState(null);

  if (!blogData || blogData.length < 2) {
    return (
      <div className="flex items-center justify-center h-[200px]" style={{ color: '#9a9bb8', fontSize: 13 }}>
        No data available
      </div>
    );
  }

  const W = 520, H = 200, PL = 40, PR = 16, PT = 30, PB = 28;
  const iW = W - PL - PR, iH = H - PT - PB;
  const n = blogData.length;
  const baseline = PT + iH;

  const allVals = [...blogData.map(d => d.val), ...csData.map(d => d.val)];
  const maxV = Math.max(...allVals) || 1;

  const makePoints = (arr) =>
    arr.map((d, i) => [PL + i * (iW / (n - 1)), PT + iH - (d.val / maxV) * iH]);

  const blogPts = makePoints(blogData);
  const csPts   = makePoints(csData);

  const T = 0.28;
  const makePath = (pts) => {
    let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
    for (let i = 1; i < pts.length; i++) {
      const dx   = pts[i][0] - pts[i - 1][0];
      const cp1x = (pts[i - 1][0] + dx * T).toFixed(2);
      const cp2x = (pts[i][0]     - dx * T).toFixed(2);
      d += ` C ${cp1x} ${pts[i - 1][1].toFixed(2)}, ${cp2x} ${pts[i][1].toFixed(2)}, ${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)}`;
    }
    return d;
  };

  const blogPathD = makePath(blogPts);
  const csPathD   = makePath(csPts);
  const blogFillD = blogPathD + ` L ${blogPts[n - 1][0]} ${baseline} L ${blogPts[0][0]} ${baseline} Z`;
  const csFillD   = csPathD   + ` L ${csPts[n - 1][0]}  ${baseline} L ${csPts[0][0]}  ${baseline} Z`;

  const yTicks = [0, Math.round(maxV / 2), maxV];
  const TW = 82, TH = 52;

  let tooltipEl = null;
  if (tooltip) {
    const px   = blogPts[tooltip.idx][0];
    const bVal = blogData[tooltip.idx].val;
    const cVal = csData[tooltip.idx].val;
    const topY = Math.min(blogPts[tooltip.idx][1], csPts[tooltip.idx][1]);
    const ty   = Math.max(PT - 4, topY - TH - 14);
    const tx   = Math.min(Math.max(px - TW / 2, 0), W - TW);
    const arrowY = ty + TH;
    tooltipEl = (
      <g>
        <line x1={px} x2={px} y1={PT} y2={baseline} stroke="#dddfee" strokeWidth="1" strokeDasharray="3 3" />
        <rect x={tx} y={ty} width={TW} height={TH} rx={6} fill="#252747" />
        <rect x={tx} y={ty} width={TW} height={3}  rx={2} fill={ACCENT} />
        <circle cx={tx + 9} cy={ty + 16} r={3} fill={ACCENT} />
        <text x={tx + 16} y={ty + 20} fontSize="9" fill="#9a9bb8">Blogs</text>
        <text x={tx + TW - 6} y={ty + 20} textAnchor="end" fontSize="11" fill="#fff" fontWeight="800">{bVal}</text>
        <circle cx={tx + 9} cy={ty + 33} r={3} fill={CS_COLOR} />
        <text x={tx + 16} y={ty + 37} fontSize="9" fill="#9a9bb8">Case</text>
        <text x={tx + TW - 6} y={ty + 37} textAnchor="end" fontSize="11" fill="#fff" fontWeight="800">{cVal}</text>
        <polygon points={`${px - 6},${arrowY} ${px + 6},${arrowY} ${px},${arrowY + 7}`} fill="#252747" />
      </g>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', overflow: 'hidden' }}>
      <defs>
        <linearGradient id="sub-blog-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={ACCENT}   stopOpacity="0.14" />
          <stop offset="100%" stopColor={ACCENT}   stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sub-cs-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={CS_COLOR} stopOpacity="0.14" />
          <stop offset="100%" stopColor={CS_COLOR} stopOpacity="0" />
        </linearGradient>
      </defs>

      {yTicks.map((t, i) => {
        const y = PT + iH - (t / maxV) * iH;
        return (
          <g key={i}>
            <line x1={PL} x2={W - PR} y1={y} y2={y} stroke="#E8EAF4" strokeWidth="1" strokeDasharray="4 5" />
            <text x={PL - 6} y={y + 4} textAnchor="end" fontSize="8.5" fill="#b0b3cc">{t}</text>
          </g>
        );
      })}

      <path d={csFillD}   fill="url(#sub-cs-g)" />
      <path d={blogFillD} fill="url(#sub-blog-g)" />
      <path d={csPathD}   fill="none" stroke={CS_COLOR} strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round" />
      <path d={blogPathD} fill="none" stroke={ACCENT}   strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {blogPts.map((p, i) => blogData[i].val > 0 && (
        <circle key={`b${i}`} cx={p[0]} cy={p[1]} r={3} fill="#fff" stroke={ACCENT}   strokeWidth="1.8" opacity="0.9" />
      ))}
      {csPts.map((p, i) => csData[i].val > 0 && (
        <circle key={`c${i}`} cx={p[0]} cy={p[1]} r={3} fill="#fff" stroke={CS_COLOR} strokeWidth="1.8" opacity="0.9" />
      ))}

      {/* Invisible hit strips */}
      {blogPts.map((_, i) => {
        const stripW = iW / (n - 1);
        const stripX = blogPts[i][0] - stripW / 2;
        return (
          <rect
            key={`hit${i}`}
            x={Math.max(stripX, PL)}
            y={PT}
            width={stripW}
            height={iH}
            fill="transparent"
            style={{ cursor: 'crosshair' }}
            onMouseEnter={() => setTooltip({ idx: i })}
            onMouseLeave={() => setTooltip(null)}
          />
        );
      })}

      {blogData.map((d, i) => (
        <text key={i} x={blogPts[i][0]} y={H - 4} textAnchor="middle" fontSize="9" fill="#b0b3cc" fontWeight="500">
          {d.month}
        </text>
      ))}

      {tooltipEl}
    </svg>
  );
}

// ── Status / Type badges ──────────────────────────────────────
const STATUS_STYLE = {
  true:  { label: 'Published', bg: '#4ade8018', color: '#16a34a', border: '#4ade8044' },
  false: { label: 'Draft',     bg: '#f59e0b18', color: '#b45309', border: '#f59e0b44' },
};

const TYPE_STYLE = {
  Blog:         { bg: ACCENT   + '18', color: ACCENT,   border: ACCENT   + '44' },
  'Case Study': { bg: CS_COLOR + '18', color: '#7c3aed', border: CS_COLOR + '44' },
};

// ── Main ─────────────────────────────────────────────────────
export default function SubAdminDashboard({ blogs, casestudies }) {
  const blogList = Array.isArray(blogs)       ? blogs       : [];
  const caseList = Array.isArray(casestudies) ? casestudies : [];

  const published = blogList.filter(b => b.status === true);
  const [servicesCount, setServicesCount] = useState(0);

  useEffect(() => {
    getServicesTableData({ limit: 1, page: 1 })
      .then(res => setServicesCount(res.totalCount || 0))
      .catch(() => {});
  }, []);

  const yr           = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-based

  const { blogData, csData } = useMemo(() => {
    const bCounts = buildMonthlyCounts(blogList, yr);
    const cCounts = buildMonthlyCounts(caseList, yr);
    const months  = MONTH_LABELS.slice(0, currentMonth + 1);
    return {
      blogData: months.map((m, i) => ({ month: m, val: bCounts[i] || 0 })),
      csData:   months.map((m, i) => ({ month: m, val: cCounts[i] || 0 })),
    };
  }, [blogList, caseList]);

  const recentPosts = useMemo(() => {
    const bl = blogList.map(b => ({ ...b, _type: 'Blog',       _editPath: `/thebusinesshub/blogs/edit/${b._id}` }));
    const cs = caseList.map(c => ({ ...c, _type: 'Case Study', _editPath: `/thebusinesshub/casestudies/edit/${c._id}` }));
    return [...bl, ...cs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
  }, [blogList, caseList]);

  const statCards = [
    { Icon: FiGrid,      label: 'Total Services', value: servicesCount,    sublabel: 'All services',   iconBg: '#474972', gradient: 'bg-gradient-to-br from-white to-[#edeafd]',   border: 'border-[#c7c9e8]/40' },
    { Icon: FiFileText,  label: 'Total Blogs',    value: blogList.length,  sublabel: 'All-time',       iconBg: '#7c7fce', gradient: 'bg-gradient-to-br from-white to-[#e8e6ff]',   border: 'border-[#c5c2f0]/40' },
    { Icon: FiGlobe,     label: 'Published',      value: published.length, sublabel: 'Live articles',  iconBg: '#22c55e', gradient: 'bg-gradient-to-br from-white to-[#dcfce7]',   border: 'border-[#4ade80]/30' },
    { Icon: FiBriefcase, label: 'Case Studies',   value: caseList.length,  sublabel: 'All-time',       iconBg: '#a78bfa', gradient: 'bg-gradient-to-br from-white to-[#ebe9f8]',   border: 'border-[#cbc9eb]/40' },
  ];

  return (
    <div className="space-y-6">
      {/* Page intro */}
      <div className="pb-1">
        <h2 className="text-[20px] font-extrabold leading-tight m-0" style={{ color: '#40415D' }}>
          Content Dashboard
        </h2>
        <p className="text-[13px] mt-1 mb-0" style={{ color: '#9a9bb8' }}>
          Manage and publish content. Lead &amp; enquiry data is restricted to Admins.
        </p>
      </div>

      {/* Restricted notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl border" style={{ background: '#7c7fce12', borderColor: '#7c7fce33' }}>
        <FiBarChart2 className="shrink-0 mt-0.5" style={{ color: ACCENT, fontSize: 16 }} />
        <p className="text-[13px] m-0" style={{ color: '#40415D' }}>
          You are logged in as <strong>Content Manager</strong>. You can manage and publish content.
          Lead &amp; enquiry data is restricted to Admins.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
        {statCards.map(({ Icon, ...rest }, i) => <StatCard key={i} Icon={Icon} {...rest} />)}
      </div>

      {/* Publishing Trend + Recent Posts — equal height */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-4 items-stretch">

        {/* Dual-series chart */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col" style={{ borderColor: 'rgba(221,223,238,0.6)' }}>
          <div className="flex items-start justify-between mb-4 shrink-0">
            <div>
              <h4 className="text-[15px] font-bold m-0 leading-tight" style={{ color: '#40415D' }}>
                Publishing Trend
              </h4>
              <p className="text-[11px] mt-0.5 mb-0" style={{ color: '#9a9bb8' }}>
                Monthly overview · {yr}
              </p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-5 h-[2.5px] rounded-full" style={{ background: ACCENT }} />
                <span className="text-[10px]" style={{ color: '#9a9bb8' }}>Blogs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-5 h-[2.5px] rounded-full" style={{ background: CS_COLOR }} />
                <span className="text-[10px]" style={{ color: '#9a9bb8' }}>Case Studies</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-hidden w-full flex-1">
            <DualAreaChart blogData={blogData} csData={csData} />
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col" style={{ borderColor: 'rgba(221,223,238,0.6)' }}>
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div>
              <h4 className="text-[15px] font-bold m-0 leading-tight" style={{ color: '#40415D' }}>Recent Posts</h4>
              <p className="text-[11px] mt-0.5 mb-0" style={{ color: '#9a9bb8' }}>Latest 10 · Blogs &amp; Case Studies</p>
            </div>
            <a
              href="/thebusinesshub/blogs/add"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-[11px] font-bold no-underline transition-opacity hover:opacity-90 shrink-0"
              style={{ background: ACCENT }}
            >
              <FiPlusCircle size={12} /> New Post
            </a>
          </div>

          <div
            className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1"
            style={{ maxHeight: 380 }}
          >
            {recentPosts.length === 0 && (
              <p className="text-[13px] text-center py-6" style={{ color: '#9a9bb8' }}>No posts yet.</p>
            )}
            {recentPosts.map((post, i) => {
              const st  = STATUS_STYLE[String(post.status)] || STATUS_STYLE.false;
              const tst = TYPE_STYLE[post._type] || TYPE_STYLE['Blog'];
              const date = post.createdAt
                ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : '';
              const authorName = post.authorName || post.author?.name || '';
              const dotColor   = post._type === 'Blog' ? ACCENT : CS_COLOR;

              return (
                <div
                  key={post._id || i}
                  className="flex items-center gap-3 p-2.5 rounded-xl transition-colors duration-150 cursor-pointer"
                  style={{ background: '#f4f3fb' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#eae9f6'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f4f3fb'}
                >
                  {/* Index dot */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ background: dotColor }}
                  >
                    {i + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold truncate mb-0.5" style={{ color: '#40415D' }}>
                      {post.title}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[9px] font-bold px-1.5 py-[2px] rounded-full shrink-0 border"
                        style={{ background: tst.bg, color: tst.color, borderColor: tst.border }}
                      >
                        {post._type}
                      </span>
                      {(authorName || date) && (
                        <span className="text-[10px] truncate" style={{ color: '#9a9bb8' }}>
                          {[authorName, date].filter(Boolean).join(' · ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status pill */}
                  <span
                    className="text-[10px] font-semibold px-2 py-[3px] rounded-full whitespace-nowrap border shrink-0"
                    style={{ background: st.bg, color: st.color, borderColor: st.border }}
                  >
                    {st.label}
                  </span>

                  <a
                    href={post._editPath}
                    className="shrink-0 hover:opacity-70 transition-opacity"
                    style={{ color: '#9a9bb8' }}
                    title="Edit"
                  >
                    <FiExternalLink size={13} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
