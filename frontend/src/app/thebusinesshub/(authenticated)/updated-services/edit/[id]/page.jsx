import UpdatedServiceForm from "../../_components/UpdatedServiceForm";

export const metadata = {
  title: "Edit Updated Service || Akoode - Admin Panel",
  description: "Edit an existing redesigned service detail page.",
};

export default function EditUpdatedServicePage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Edit Updated Service</h2>
          <p>Update the details for this service page. Toggle each section on/off as needed.</p>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="my_dashboard_review mb40">
          <div className="row">
            <div className="col-lg-12">
              <UpdatedServiceForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
