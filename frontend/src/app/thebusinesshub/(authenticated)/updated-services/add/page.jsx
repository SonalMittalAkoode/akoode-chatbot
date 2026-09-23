import UpdatedServiceForm from "../_components/UpdatedServiceForm";

export const metadata = {
  title: "Add Updated Service || Akoode - Admin Panel",
  description: "Create a new redesigned service detail page.",
};

export default function AddUpdatedServicePage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Add Updated Service</h2>
          <p>Fill in the details below to create a new service page. Toggle each section on/off as needed.</p>
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
