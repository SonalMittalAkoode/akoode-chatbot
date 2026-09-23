import "../globals.css";
import ClientToastProvider from "@/components/ClientToastProvider";

export const metadata = {
  title: "Akoode Admin Panel",
  description: "Akoode Admin Panel - Manage your content and enquiries",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }) {
  return (
    <>
        {/* Bootstrap 5 – admin CSS expects .row, .container-fluid, .col-*, .collapse, etc. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
        {/* Admin panel CSS from public/admin/css */}
        <link rel="stylesheet" href="/admin/css/main.css" />
        <link rel="stylesheet" href="/admin/css/dashbord_navitaion.css" />
        <link rel="stylesheet" href="/admin/css/ace-responsive-menu.css" />
        {/* Override admin template color cascade — must come after all admin CSS links */}
        <style>{`
          body { color: #40415D !important; }
          .breadcrumb_title,
          .breadcrumb_content h1,
          .breadcrumb_content h2,
          .breadcrumb_content h3,
          .breadcrumb_content p,
          .my_dashboard_review h2,
          .my_dashboard_review h3,
          .my_dashboard_review h4,
          .my_dashboard_review label,
          .my_dashboard_review p,
          .inner_page_breadcrumb .breadcrumb_title {
            color: #40415D !important;
          }
        `}</style>
        {children}
        <ClientToastProvider />
    </>
  )
}
