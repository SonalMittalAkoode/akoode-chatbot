import TableData from "./_components/TableData";

export const metadata = {
  title: "Contact Enquiries || Akoode - Admin Panel",
  description: "Manage contact form submissions.",
};

export default function EnquiryListPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Contact Enquiries</h2>
          <p>View and manage all contact form submissions from your website.</p>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="my_dashboard_review mb40">
          <div className="property_table">
            <div className="table-responsive mt0">
              <TableData source="contact" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
