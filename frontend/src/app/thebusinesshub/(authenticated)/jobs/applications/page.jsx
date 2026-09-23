import JobApplicationsContent from "./_components/JobApplicationsContent";

export const metadata = {
  title: "Job Applications || Akoode - Admin Panel",
  description: "Review and manage job applications.",
};

export default function JobApplicationsPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Job Applications</h2>
          <p>Review and manage all candidate applications submitted for open positions.</p>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="my_dashboard_review mb40">
          <div className="property_table">
            <div className="table-responsive mt0">
              <JobApplicationsContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
