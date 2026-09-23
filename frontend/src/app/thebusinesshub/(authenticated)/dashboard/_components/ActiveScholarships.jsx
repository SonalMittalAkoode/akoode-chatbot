'use client'

import { useEffect, useState } from 'react';
import { getEnquiryTableData } from '@/api/enquiry';

const SOURCE_COLOR = {
  'contact':          '#7c7fce',
  'post-requirement': '#4ade80',
  'general':          '#a78bfa',
  'job-application':  '#f59e0b',
};

const SOURCE_LABEL = {
  'contact':          'Contact',
  'post-requirement': 'Post Req',
  'general':          'General',
  'job-application':  'Job App',
};

const AVATAR_COLORS = ['#7c7fce', '#4ade80', '#f59e0b', '#a78bfa', '#f87171', '#fb923c'];
const avatarBg  = (name = '') => AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
const initials  = (name = '') =>
  name.split(' ').map(w => w[0]).filter(Boolean).join('').toUpperCase().slice(0, 2) || '?';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7)  return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ActiveScholarships() {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEnquiryTableData({ limit: 10, page: 1 })
      .then(res => setItems(Array.isArray(res?.items) ? res.items : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#dddfee]/60 flex flex-col" style={{ minHeight: 300 }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4 shrink-0">
        <div>
          <h4 className="text-[15px] font-bold m-0 leading-tight" style={{ color: '#40415D' }}>Activity</h4>
          <p className="text-[11px] mt-0.5 mb-0" style={{ color: '#9a9bb8' }}>Recent requests</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: '#edeafd', color: '#474972' }}>
          Live
        </span>
      </div>

      {/* Scrollable list — fixed height, no "View More" */}
      <div
        className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1"
        style={{ maxHeight: 360 }}
      >
        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#474972', borderTopColor: 'transparent' }} />
          </div>
        )}

        {!loading && items.length === 0 && (
          <p className="text-center text-[13px] py-8" style={{ color: '#9a9bb8' }}>No recent activity.</p>
        )}

        {!loading && items.map((item, i) => {
          const name    = item.fullName || item.name || 'Unknown';
          const source  = item.source || 'contact';
          const color   = SOURCE_COLOR[source] ?? SOURCE_COLOR['contact'];
          const srcLabel= SOURCE_LABEL[source] ?? 'Enquiry';
          const msg     = item.message || item.description || item.requirement || '';
          const preview = msg.trim().slice(0, 42) + (msg.trim().length > 42 ? '…' : '');

          return (
            <div
              key={item._id ?? i}
              className="flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150"
              style={{ background: '#f4f3fb' }}
              onMouseEnter={e => e.currentTarget.style.background = '#eae9f6'}
              onMouseLeave={e => e.currentTarget.style.background = '#f4f3fb'}
            >
              {/* Avatar with source colour ring */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 mt-0.5"
                style={{ background: avatarBg(name), outline: `2px solid ${color}33` }}
              >
                {initials(name)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[12px] font-semibold truncate" style={{ color: '#40415D' }}>
                    {name.length > 16 ? name.slice(0, 16) + '…' : name}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-px rounded-full shrink-0"
                    style={{ background: color + '22', color }}>
                    {srcLabel}
                  </span>
                </div>
                {preview ? (
                  <div className="text-[11px] leading-snug" style={{ color: '#6e6f8a' }}>{preview}</div>
                ) : (
                  <div className="text-[10px]" style={{ color: '#9a9bb8' }}>No message</div>
                )}
                <div className="text-[10px] mt-0.5" style={{ color: '#b0b3cc' }}>{timeAgo(item.createdAt)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
