import TableData from "./_components/TableData";

export const metadata = {
  title: "Testimonial Videos || Akoode - Admin Panel",
  description: "Manage client testimonial videos.",
};

export default function VideoListPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">All Testimonial Videos</h2>
          <p>View, edit, and manage client testimonial videos on your platform.</p>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="my_dashboard_review mb40">
          <div className="property_table">
            <div className="table-responsive mt0">
              <TableData />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
