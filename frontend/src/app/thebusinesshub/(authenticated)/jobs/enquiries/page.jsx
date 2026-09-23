import TableData from "./_components/TableData";

export const metadata = {
  title: "Job Enquiries || Akoode - Admin Panel",
  description: "Manage job-related inquiries.",
};

export default function JobEnquiryPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Job Enquiries</h2>
          <p>View and manage general inquiries related to job openings and careers.</p>
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
