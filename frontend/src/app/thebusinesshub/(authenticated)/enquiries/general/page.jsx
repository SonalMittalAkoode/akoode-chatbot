import GeneralEnquiryContent from "./_components/GeneralEnquiryContent";

export const metadata = {
  title: "General Enquiries || Akoode - Admin Panel",
  description: "Manage general inquiry submissions.",
};

export default function GeneralEnquiryPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">General Enquiries</h2>
          <p>View and manage general inquiries from your website.</p>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="my_dashboard_review mb40">
          <div className="property_table">
            <div className="table-responsive mt0">
              <GeneralEnquiryContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
