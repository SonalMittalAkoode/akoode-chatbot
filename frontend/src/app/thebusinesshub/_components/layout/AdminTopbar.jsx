'use client'
import Image from "next/image";

import { usePathname } from "next/navigation";
import DashboardAdminAvatar from "@/app/thebusinesshub/(authenticated)/dashboard/_components/DashboardAdminAvatar";

const PAGE_TITLES = {
  '/thebusinesshub/dashboard':                  'Dashboard',
  '/thebusinesshub/employees':                  'Employees',
  '/thebusinesshub/blogs':                      'Blogs',
  '/thebusinesshub/casestudies':                'Case Studies',
  '/thebusinesshub/services':                   'Services',
  '/thebusinesshub/testimonials':               'Testimonials',
  '/thebusinesshub/faqs':                       'FAQs',
  '/thebusinesshub/ratings':                    'Ratings',
  '/thebusinesshub/jobs':                       'Job Postings',
  '/thebusinesshub/enquiries':                  'Enquiries',
  '/thebusinesshub/subscribers':                'Subscribers',
  '/thebusinesshub/life':                       'Life at Akoode',
  '/thebusinesshub/profile':                    'Profile',
};

function getPageTitle(pathname) {
  if (!pathname) return 'Dashboard';
  for (const [prefix, title] of Object.entries(PAGE_TITLES)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) return title;
  }
  return 'Admin Panel';
}

export default function AdminTopbar({ onMenuClick }) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-50 bg-[#f4f3fb]/90 backdrop-blur-xl border-b border-[#dddfee] flex items-center gap-3 px-5 sm:px-5 h-[56px] sm:h-[60px] shrink-0" style={{ color: '#40415D' }}>
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="w-9 h-9 rounded-xl border border-[#dddfee] bg-white flex flex-col items-center justify-center gap-[4px] p-2.5 shadow-sm hover:bg-[#edeafd] hover:border-[#474972] transition-all duration-150 shrink-0"
        aria-label="Toggle sidebar"
      >
        <span className="block w-4 h-[2px] bg-[#40415D] rounded-full" />
        <span className="block w-3 h-[2px] bg-[#40415D] rounded-full" />
        <span className="block w-4 h-[2px] bg-[#40415D] rounded-full" />
      </button>

      {/* Title */}
      {/* <h1 className="text-[15px] sm:text-[17px] font-bold m-0 leading-tight truncate" style={{ color: '#40415D' }}>
        {title}
      </h1> */}
      <Image
        src="/logo-dark.png"
        alt="Akoode Logo"
        width={110}
        height={36}
        className="object-contain w-[90px] sm:w-[110px] h-auto"
        priority
      />

      <div className="flex-1" />

      {/* Profile */}
      <DashboardAdminAvatar />
    </header>
  );
}
