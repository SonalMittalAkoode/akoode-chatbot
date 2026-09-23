'use client'

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdDashboard,
} from 'react-icons/md';
import {
  FiImage, FiUsers, FiStar, FiBriefcase, FiFileText,
  FiGrid, FiBarChart2, FiMessageSquare, FiHelpCircle,
  FiMail, FiChevronDown, FiGlobe,
} from 'react-icons/fi';

const NAV_GROUPS = [
  {
    label: 'Main Menu',
    items: [
      { label: 'Dashboard', route: '/thebusinesshub/dashboard', icon: MdDashboard, single: true },
    ],
  },
  {
    label: 'Manage Listings',
    items: [
      {
        label: 'Life at Akoode', icon: FiImage, key: 'life',
        children: [
          { label: 'Add Life at Akoode', route: '/thebusinesshub/life/add' },
          { label: 'Life at Akoode List', route: '/thebusinesshub/life' },
        ],
      },
      {
        label: 'Employees', icon: FiUsers, key: 'employee',
        children: [
          { label: 'Add Employee', route: '/thebusinesshub/employees/add' },
          { label: 'Employee List', route: '/thebusinesshub/employees' },
        ],
      },
      {
        label: 'Ratings', icon: FiStar, key: 'rating',
        children: [
          { label: 'Add Rating', route: '/thebusinesshub/ratings/add' },
          { label: 'Rating List', route: '/thebusinesshub/ratings' },
        ],
      },
      {
        label: 'Job Postings', icon: FiBriefcase, key: 'job',
        children: [
          { label: 'Add Job Posting', route: '/thebusinesshub/jobs/add' },
          { label: 'Job Posting List', route: '/thebusinesshub/jobs' },
        ],
      },
      {
        label: 'Blogs', icon: FiFileText, key: 'blog',
        children: [
          { label: 'Add Blog Category', route: '/thebusinesshub/blogs/categories/add' },
          { label: 'Blog Category List', route: '/thebusinesshub/blogs/categories' },
          { label: 'Add Category Group', route: '/thebusinesshub/blogs/categorygroups/add' },
          { label: 'Category Group List', route: '/thebusinesshub/blogs/categorygroups' },
          { label: 'Add Blog', route: '/thebusinesshub/blogs/add' },
          { label: 'Blog List', route: '/thebusinesshub/blogs' },
        ],
      },
      {
        label: 'Services', icon: FiGrid, key: 'services',
        children: [
          { label: 'Add Services', route: '/thebusinesshub/services/add' },
          { label: 'Services List', route: '/thebusinesshub/services' },
        ],
      },
      {
        label: 'Updated Services', icon: FiGrid, key: 'updatedservices',
        children: [
          { label: 'Add Updated Service', route: '/thebusinesshub/updated-services/add' },
          { label: 'Updated Services List', route: '/thebusinesshub/updated-services' },
        ],
      },
      {
        label: 'Industries', icon: FiGrid, key: 'industries',
        children: [
          { label: 'Add Industry', route: '/thebusinesshub/industries/add' },
          { label: 'Industry List', route: '/thebusinesshub/industries' },
        ],
      },
      {
        label: 'Location Pages', icon: FiGlobe, key: 'locationpages',
        children: [
          { label: 'Add Country Page', route: '/thebusinesshub/service-by-country/add' },
          { label: 'Country Pages List', route: '/thebusinesshub/service-by-country' },
          { label: 'Add City Page', route: '/thebusinesshub/service-by-city/add' },
          { label: 'City Pages List', route: '/thebusinesshub/service-by-city' },
        ],
      },
      {
        label: 'Case Studies', icon: FiBarChart2, key: 'casestudy',
        children: [
          { label: 'Add Case Study', route: '/thebusinesshub/casestudies/add' },
          { label: 'Case Study List', route: '/thebusinesshub/casestudies' },
        ],
      },
      {
        label: 'Case Study Latest', icon: FiBarChart2, key: 'casestudylatest',
        children: [
          { label: 'Add Case Study Latest', route: '/thebusinesshub/case-study-latest/add' },
          { label: 'Case Study Latest List', route: '/thebusinesshub/case-study-latest' },
        ],
      },
      {
        label: 'Testimonials', icon: FiMessageSquare, key: 'testimonial',
        children: [
          { label: 'Add Testimonial', route: '/thebusinesshub/testimonials/add' },
          { label: 'Testimonial List', route: '/thebusinesshub/testimonials' },
          { label: 'Add Video', route: '/thebusinesshub/testimonials/videos/add' },
          { label: 'Video List', route: '/thebusinesshub/testimonials/videos' },
        ],
      },
      {
        label: 'FAQs', icon: FiHelpCircle, key: 'faq',
        children: [
          { label: 'Add FAQ', route: '/thebusinesshub/faqs/add' },
          { label: 'FAQ List', route: '/thebusinesshub/faqs' },
        ],
      },
      {
        label: 'Enquiries', icon: FiMail, key: 'enquiry', adminOnly: true,
        children: [
          { label: 'Contact Enquiry',       route: '/thebusinesshub/enquiries' },
          { label: 'Post Requirement',       route: '/thebusinesshub/enquiries/requirements' },
          { label: 'General Enquiry',        route: '/thebusinesshub/enquiries/general' },
          { label: 'Job Applications',       route: '/thebusinesshub/jobs/applications' },
          { label: 'Newsletter Subscribers', route: '/thebusinesshub/subscribers' },
        ],
      },
    ],
  },
];

// ── Single nav item ───────────────────────────────────────────
function NavItem({ label, route, icon: Icon, children, onClose, adminOnly, isSubAdmin }) {
  const pathname = usePathname();

  const isChildActive = children?.some(
    c => pathname === c.route || pathname?.startsWith(c.route + '/')
  );
  const isActive = route
    ? pathname === route || pathname?.startsWith(route + '/')
    : isChildActive;

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isChildActive) setExpanded(true);
  }, [isChildActive]);

  if (adminOnly && isSubAdmin) return null;

  const base     = 'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-[13px] font-medium mb-0.5 w-full text-left';
  const active   = { background: '#edeafd', color: '#474972' };
  const inactive = {};

  if (children) {
    return (
      <div>
        <button
          onClick={() => setExpanded(e => !e)}
          className={base}
          style={isActive ? active : inactive}
          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f4f3fb'; }}
          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = ''; }}
        >
          <Icon size={16} style={{ color: isActive ? '#474972' : '#9a9bb8', flexShrink: 0 }} />
          <span className="flex-1" style={{ color: isActive ? '#474972' : '#6e6f8a' }}>{label}</span>
          <FiChevronDown
            size={13}
            style={{
              color: isActive ? '#474972' : '#9a9bb8',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
              flexShrink: 0,
            }}
          />
        </button>

        <div
          style={{
            overflow: 'hidden',
            maxHeight: expanded ? 600 : 0,
            opacity: expanded ? 1 : 0,
            transition: 'max-height 0.22s ease, opacity 0.18s ease',
          }}
        >
          <div className="ml-4 pl-3 flex flex-col gap-0.5 mb-1 pt-0.5" style={{ borderLeft: '2px solid #edeafd' }}>
            {children.map(child => (
              <Link
                key={child.route}
                href={child.route}
                onClick={onClose}
                className="block py-1.5 px-2 text-[12px] rounded-lg transition-colors duration-150 no-underline font-medium"
                style={{
                  color: pathname === child.route ? '#474972' : '#6e6f8a',
                  background: pathname === child.route ? '#f0effe' : undefined,
                  fontWeight: pathname === child.route ? 600 : 500,
                }}
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={route}
      onClick={onClose}
      className={`${base} no-underline`}
      style={isActive ? active : inactive}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f4f3fb'; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = ''; }}
    >
      <Icon size={16} style={{ color: isActive ? '#474972' : '#9a9bb8', flexShrink: 0 }} />
      <span style={{ color: isActive ? '#474972' : '#6e6f8a' }}>{label}</span>
    </Link>
  );
}

// ── Main sidebar ──────────────────────────────────────────────
export default function AdminSidebar({ open, onClose, isSubAdmin }) {
  const [userData, setUserData] = useState({ name: 'Admin', role: '' });

  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem('user') || '{}');
      const name = [stored.firstname, stored.lastname].filter(Boolean).join(' ') || stored.role || 'Admin';
      setUserData({ name, role: stored.role || '' });
    } catch {
      setUserData({ name: 'Admin', role: '' });
    }
  }, []);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-[99] backdrop-blur-sm"
          style={{ background: 'rgba(64,65,93,0.3)' }}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-[240px] bg-white z-[100] flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ color: '#40415D', borderRight: '1px solid #dddfee', boxShadow: '4px 0 32px rgba(64,65,93,0.12)' }}
      >
        {/* Logo header */}
        <div className="flex items-center gap-2 px-4 py-3 shrink-0" style={{ borderBottom: '1px solid #dddfee' }}>
          <Link href="/thebusinesshub/dashboard" onClick={onClose} className="flex-1 min-w-0 flex items-center">
            <Image
              src="/logo-dark.png"
              alt="Akoode Logo"
              width={130}
              height={38}
              style={{ maxWidth: '100%', height: 'auto' }}
              priority
            />
          </Link>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 text-base"
            style={{ color: '#9a9bb8' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f4f3fb'}
            onMouseLeave={e => e.currentTarget.style.background = ''}
          >
            ✕
          </button>
        </div>

        {/* Role badge */}
        <div className="px-4 pt-3 shrink-0">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold"
            style={isSubAdmin
              ? { background: '#4ade8018', border: '1px solid #4ade8033', color: '#16a34a' }
              : { background: 'rgba(71,73,114,0.1)', border: '1px solid rgba(71,73,114,0.2)', color: '#474972' }
            }
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: isSubAdmin ? '#4ade80' : '#474972' }}
            />
            {isSubAdmin ? 'Content Manager' : 'Super Admin'}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 custom-scrollbar">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-2' : ''}>
              <div
                className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 mb-1"
                style={{ color: '#9a9bb8' }}
              >
                {group.label}
              </div>
              {group.items.map((item, ii) => (
                <NavItem
                  key={item.key ?? item.route ?? ii}
                  label={item.label}
                  route={item.route}
                  icon={item.icon}
                  children={item.children}
                  adminOnly={item.adminOnly}
                  single={item.single}
                  onClose={onClose}
                  isSubAdmin={isSubAdmin}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-3 flex items-center gap-2.5 shrink-0" style={{ borderTop: '1px solid #dddfee' }}>
          <Image
            src="/fav-logo1.png"
            alt="Admin"
            width={32}
            height={32}
            className="rounded-lg object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold truncate" style={{ color: '#40415D' }}>{userData.name}</div>
            <div className="text-[10px] truncate" style={{ color: '#9a9bb8' }}>
              {isSubAdmin ? 'Content Manager' : 'Super Admin'}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
