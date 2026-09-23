'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutAdminUser } from "@/api/user";
import { toast } from "react-toastify";

const DashboardAdminAvatar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const dropdownRef = useRef(null);

  // Load user data from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem('user') || '{}');
      const name = [stored.firstname, stored.lastname].filter(Boolean).join(' ') || stored.role || 'Admin';
      setUserData({ name, email: stored.email || '' });
    } catch { setUserData({ name: 'Admin', email: '' }); }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutAdminUser();
    sessionStorage.removeItem('user');
    localStorage.removeItem('adminRememberMe');
    router.push('/thebusinesshub');
  };

  const handleChangePassword = (e) => {
    const currentRole = JSON.parse(sessionStorage.getItem("user") || "{}")?.role || "";
    if (currentRole === "sub-admin") {
      e.preventDefault();
      setOpen(false);
      toast.warning("You are not allowed to change password.");
      return;
    }
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative z-[1000]">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-3 py-1.5 rounded-xl border border-[#dddfee] bg-white hover:bg-[#f4f3fb] transition-colors duration-150 cursor-pointer"
      >
        <Image
          width={32}
          height={32}
          className="rounded-lg object-cover shrink-0"
          src="/fav-logo1.png"
          alt="Admin Avatar"
        />
        <div className="text-left hidden sm:block max-w-[120px]">
          <div className="text-[13px] font-bold text-[#40415D] leading-tight truncate">{userData.name}</div>
          {userData.email && (
            <div className="text-[10px] text-[#9a9bb8] leading-tight truncate">{userData.email}</div>
          )}
        </div>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-[#9a9bb8] hidden sm:block" style={{ transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.2s', flexShrink: 0 }}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-[#dddfee] z-[9999] overflow-hidden py-1.5">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#dddfee]">
            <Image
              width={36}
              height={36}
              className="rounded-lg object-cover shrink-0"
              src="/fav-logo1.png"
              alt="Admin"
            />
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-[#40415D] truncate">{userData.name}</div>
              {userData.email && (
                <div className="text-[11px] text-[#9a9bb8] truncate">{userData.email}</div>
              )}
            </div>
          </div>
          <Link
            href="/thebusinesshub/profile"
            className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-[#40415D] hover:bg-[#f4f3fb] transition-colors no-underline"
            onClick={handleChangePassword}
          >
            <span className="text-base">🔑</span> Change Password
          </Link>
          <button
            onClick={() => { setOpen(false); handleLogout(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-[#f87171] hover:bg-[#f871711a] transition-colors text-left border-t border-[#dddfee] mt-1"
          >
            <span className="text-base">🚪</span> Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardAdminAvatar;
