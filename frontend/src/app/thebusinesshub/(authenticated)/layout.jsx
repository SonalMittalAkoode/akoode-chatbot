"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/app/thebusinesshub/_components/layout/AdminSidebar";
import AdminTopbar from "@/app/thebusinesshub/_components/layout/AdminTopbar";
import CopyRight from "@/components/CopyRight";
import { verifyAdminSessionAPI } from "@/api/adminlogin";

export default function AuthenticatedLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubAdmin, setIsSubAdmin] = useState(false);
  // null = checking, false = not authed (redirecting), true = authed
  const [isAuthed, setIsAuthed] = useState(null);

  // Auth guard: block every authenticated admin page unless a valid session exists.
  // The session lives in sessionStorage (cleared when the tab closes), and the
  // token is re-verified with the backend before anything protected renders —
  // a fabricated or expired session object can't get past this. Children are
  // not rendered until the server confirms the session.
  useEffect(() => {
    // Purge any long-lived session left over from the old localStorage-based
    // auth so previously "remembered" browsers are forced back through login.
    try {
      localStorage.removeItem("user");
    } catch {}

    let userData = null;
    try {
      userData = JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      userData = null;
    }

    const token = userData?.token;
    if (!token) {
      setIsAuthed(false);
      router.replace("/thebusinesshub"); // redirect to login
      return;
    }

    const role = userData?.role;
    setIsSubAdmin(role === "sub-admin");

    const blockedForSubAdmin = [
      "/thebusinesshub/enquiries",
      "/thebusinesshub/enquiries/requirements",
      "/thebusinesshub/enquiries/general",
      "/thebusinesshub/jobs/applications",
      "/thebusinesshub/subscribers",
    ];
    if (role === "sub-admin" && blockedForSubAdmin.some((p) => pathname?.startsWith(p))) {
      router.replace("/thebusinesshub/dashboard");
    }

    let cancelled = false;
    (async () => {
      try {
        const valid = await verifyAdminSessionAPI(token);
        if (cancelled) return;
        if (!valid) {
          // Token rejected by the server (expired, tampered, user removed).
          sessionStorage.removeItem("user");
          setIsAuthed(false);
          router.replace("/thebusinesshub");
          return;
        }
        setIsAuthed(true);
      } catch {
        // Backend unreachable (network hiccup, API restart). Don't force a
        // logout for connectivity issues — the session object is present and
        // every data call will fail visibly anyway if the API stays down.
        if (!cancelled) setIsAuthed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // While checking, or when not authenticated, render nothing protected.
  if (isAuthed !== true) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f3fb] font-sans">
        <span className="text-sm text-[#777]">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f3fb] font-sans">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isSubAdmin={isSubAdmin}
      />

      <div className="flex flex-col min-h-screen">
        <AdminTopbar onMenuClick={() => setSidebarOpen((o) => !o)} />

        {/* style override: admin main.css sets body { color:#777 } — reset here so Tailwind colors show correctly */}
        <main className="flex-1 p-5 sm:p-5 md:p-6 overflow-x-clip" style={{ color: '#40415D' }}>
          {children}
        </main>

        <CopyRight />
      </div>
    </div>
  );
}
