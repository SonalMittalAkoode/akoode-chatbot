'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { FiUsers, FiFileText, FiBriefcase, FiInbox, FiTrendingUp, FiActivity, FiMessageSquare } from 'react-icons/fi';
import { getEnquiryCountBySource, getEnquiryWeeklyCount, getEnquiryMonthlyCount } from "@/api/enquiry";

function StatCard({ Icon, label, sublabel, value, iconBg, cardTo, border, highlight, resetLabel, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br from-white ${cardTo} p-5 shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md group`}
    >
      {/* Faded background icon */}
      <Icon
        size={88}
        className="absolute -bottom-3 -right-3 pointer-events-none select-none transition-transform duration-300 group-hover:scale-110"
        style={{ color: iconBg, opacity: 0.08 }}
      />

      {/* Icon box */}
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm" style={{ background: iconBg }}>
        <Icon size={18} color="#fff" />
      </div>

      {/* Label */}
      <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#6e6f8a' }}>
        {label}
      </div>

      {/* Value */}
      <div className="text-[36px] font-extrabold leading-none mb-2" style={{ color: '#40415D' }}>
        {value}
      </div>

      {/* Sublabel — highlighted pill or plain */}
      {highlight ? (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: `${iconBg}18`,
          color: iconBg,
          fontSize: 10,
          fontWeight: 700,
          padding: '3px 9px',
          borderRadius: 20,
          border: `1px solid ${iconBg}35`,
          letterSpacing: 0.3,
        }}>
          {sublabel}
        </span>
      ) : (
        <div className="text-[11px]" style={{ color: '#9a9bb8' }}>{sublabel}</div>
      )}

      {/* Reset indicator */}
      {resetLabel && (
        <div className="mt-1.5 flex items-center gap-1 text-[10px]" style={{ color: '#b0b3cc' }}>
          <span>↺</span>
          <span>{resetLabel}</span>
        </div>
      )}
    </div>
  );
}

const ENQUIRY_CARDS = [
  {
    key:        'generalJobApp',
    Icon:        FiInbox,
    label:      'General & Job Applications',
    sublabel:   'All-time Total',
    highlight:  false,
    route:      '/thebusinesshub/enquiries/general',
    iconBg:     '#474972',
    cardTo:     'to-[#ebe9f8]',
    border:     'border-[#cbc9eb]/40',
  },
  {
    key:        'weekly',
    Icon:        FiTrendingUp,
    label:      'This Week',
    sublabel:   'Contact + Post Req',
    highlight:  true,
    resetLabel: 'Resets every Monday',
    route:      '/thebusinesshub/enquiries',
    iconBg:     '#22c55e',
    cardTo:     'to-[#f0fdf4]',
    border:     'border-[#d1fae5]/40',
  },
  {
    key:        'monthly',
    Icon:        FiActivity,
    label:      'This Month',
    sublabel:   'Contact + Post Req',
    highlight:  true,
    resetLabel: 'Resets on the 1st',
    route:      '/thebusinesshub/enquiries',
    iconBg:     '#f59e0b',
    cardTo:     'to-[#fffbeb]',
    border:     'border-[#fde68a]/30',
  },
  {
    key:        'contactPostTotal',
    Icon:        FiMessageSquare,
    label:      'Contact + Post Requirement',
    sublabel:   'All-time Total',
    highlight:  true,
    route:      '/thebusinesshub/enquiries',
    iconBg:     '#6366f1',
    cardTo:     'to-[#eef2ff]',
    border:     'border-[#c7d2fe]/40',
  },
];

const CONTENT_CARDS = [
  {
    key:       'employees',
    Icon:       FiUsers,
    label:     'All Employees',
    sublabel:  'Total Employees',
    highlight: false,
    route:     '/thebusinesshub/employees',
    iconBg:    '#474972',
    cardTo:    'to-[#edeafd]',
    border:    'border-[#c7c9e8]/40',
  },
  {
    key:       'blogs',
    Icon:       FiFileText,
    label:     'Total Blogs',
    sublabel:  'Published Articles',
    highlight: false,
    route:     '/thebusinesshub/blogs',
    iconBg:    '#7c7fce',
    cardTo:    'to-[#e8e6ff]',
    border:    'border-[#c5c2f0]/40',
  },
  {
    key:       'casestudies',
    Icon:       FiBriefcase,
    label:     'Total Case Studies',
    sublabel:  'All Case Studies',
    highlight: false,
    route:     '/thebusinesshub/casestudies',
    iconBg:    '#a78bfa',
    cardTo:    'to-[#eae9f6]',
    border:    'border-[#c9c8ea]/40',
  },
];

const AllStatistics = ({ employees, blogs, casestudies, enquiryChart }) => {
  const router = useRouter();
  const [userRole, setUserRole]               = useState('');
  const [generalJobApp, setGeneralJobApp]     = useState(0);
  const [contactPostTotal, setContactPostTotal] = useState(0);
  const [weekly, setWeekly]                   = useState(0);
  const [monthly, setMonthly]                 = useState(0);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    setUserRole(userData?.role || '');
  }, []);

  useEffect(() => {
    Promise.all([getEnquiryCountBySource('general'), getEnquiryCountBySource('job-application')])
      .then(([gen, job]) => setGeneralJobApp(gen + job))
      .catch(() => {});

    Promise.all([getEnquiryCountBySource('contact'), getEnquiryCountBySource('post-requirement')])
      .then(([c, p]) => setContactPostTotal(c + p))
      .catch(() => {});

    getEnquiryWeeklyCount(['contact', 'post-requirement']).then(setWeekly).catch(() => {});
    getEnquiryMonthlyCount(['contact', 'post-requirement']).then(setMonthly).catch(() => {});
  }, []);

  const values = useMemo(() => ({
    employees:       Array.isArray(employees)   ? employees.length   : 0,
    blogs:           Array.isArray(blogs)        ? blogs.length       : 0,
    casestudies:     Array.isArray(casestudies)  ? casestudies.length : 0,
    generalJobApp,
    contactPostTotal,
    weekly,
    monthly,
  }), [employees, blogs, casestudies, generalJobApp, contactPostTotal, weekly, monthly]);

  const handleCardClick = (route) => {
    if (userRole === 'sub-admin' && route === '/thebusinesshub/enquiries') {
      toast.warning('You are not allowed to access enquiry listings.');
      return;
    }
    router.push(route);
  };

  return (
    <div className="space-y-5">

      {/* ── Enquiry Analytics ─────────────────────────── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest mb-2.5" style={{ color: '#9a9bb8' }}>
          Enquiry Analytics
        </p>
        <div className="grid grid-cols-12 gap-4 items-stretch">

          {/* Left 6 cols: chart */}
          {enquiryChart && (
            <div
              className="col-span-12 lg:col-span-6 bg-white rounded-2xl border shadow-sm p-4 sm:p-5 flex flex-col"
              style={{ borderColor: 'rgba(221,223,238,0.6)' }}
            >
              {enquiryChart}
            </div>
          )}

          {/* Right 6 cols: 2×2 card grid */}
          <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            {ENQUIRY_CARDS.map(({ key, ...rest }) => (
              <StatCard
                key={key}
                {...rest}
                value={values[key]}
                onClick={() => handleCardClick(rest.route)}
              />
            ))}
          </div>

        </div>
      </div>

      {/* ── Content & Team ────────────────────────────── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest mb-2.5" style={{ color: '#9a9bb8' }}>
          Content & Team
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {CONTENT_CARDS.map(({ key, ...rest }) => (
            <StatCard
              key={key}
              {...rest}
              value={values[key]}
              onClick={() => handleCardClick(rest.route)}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default AllStatistics;
