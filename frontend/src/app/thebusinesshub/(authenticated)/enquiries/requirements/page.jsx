import RequirementsContent from "./_components/RequirementsContent";

export const metadata = {
  title: "Post Requirement Enquiries || Akoode - Admin Panel",
  description: "Manage requirement form submissions.",
};

export default function RequirementEnquiryPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Post Requirement Enquiries</h2>
          <p>View and manage project requirement submissions.</p>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="my_dashboard_review mb40">
          <div className="property_table">
            <div className="table-responsive mt0">
              <RequirementsContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
