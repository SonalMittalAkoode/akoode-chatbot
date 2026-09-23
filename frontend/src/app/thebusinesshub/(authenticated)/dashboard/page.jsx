import AllStatistics from "./_components/AllStatistics";
import StatisticsChart from "./_components/StatisticsChart";
import ActiveScholarships from "./_components/ActiveScholarships";
import TotalServicesChart from "./_components/TotalServicesChart";
import DashboardRouter from "./_components/DashboardRouter";
import { getBlogTableData } from "@/api/blog";
import { getCasestudyTableData } from "@/api/casestudy";

export const metadata = {
  title: "Dashboard || Akoode - Admin Panel",
  description: "Akoode - Admin Panel",
};

async function fetchEmployees() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
    const res = await fetch(`${apiUrl}api/employee`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch { return []; }
}

export default async function MyDashboardPage() {
  try {
    const [employeeRes, blogRes, casestudyRes] = await Promise.all([
      fetchEmployees(),
      getBlogTableData({ limit: 100, page: 1 }).catch(() => ({ items: [] })),
      getCasestudyTableData({ limit: 100, page: 1 }).catch(() => ({ items: [] })),
    ]);

    const employees   = Array.isArray(employeeRes)    ? employeeRes       : [];
    const blogs       = Array.isArray(blogRes?.items)  ? blogRes.items     : [];
    const casestudies = casestudyRes?.items            || [];

    // ── Admin dashboard (shown when role === 'admin') ──────────
    const adminView = (
      <div className="space-y-6 min-h-full">
        {/* Page intro */}
        <div className="pb-1">
          <h2 className="text-[20px] font-extrabold leading-tight m-0" style={{ color: '#40415D' }}>
            Akoode Intelligence Hub
          </h2>
          <p className="text-[13px] mt-1 mb-0 max-w-xl" style={{ color: '#9a9bb8' }}>
            Your unified control center for performance analytics, content management, and organizational intelligence.
          </p>
        </div>

        {/* Stat Cards + Enquiry Chart */}
        <AllStatistics
          employees={employees}
          blogs={blogs}
          casestudies={casestudies}
          enquiryChart={
            <div className="flex flex-col h-full">
              <div className="mb-4 shrink-0">
                <h4 className="text-[15px] font-bold m-0 leading-tight" style={{ color: '#40415D' }}>
                  Enquiries
                </h4>
                <p className="text-[11px] mt-0.5 mb-0" style={{ color: '#9a9bb8' }}>
                  Monthly overview · {new Date().getFullYear()}
                </p>
              </div>
              <div className="flex-1 min-h-0">
                <StatisticsChart />
              </div>
            </div>
          }
        />

        {/* Activity + Donut */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <ActiveScholarships />
          <TotalServicesChart />
        </div>
      </div>
    );

    return (
      <DashboardRouter adminView={adminView} blogs={blogs} casestudies={casestudies} />
    );
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return (
      <div className="flex items-center justify-center min-h-[300px] text-[14px]" style={{ color: '#9a9bb8' }}>
        Failed to load dashboard content.
      </div>
    );
  }
}
