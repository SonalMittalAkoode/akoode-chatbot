import CreateList from "./_components/CreateList";

export const metadata = {
  title: "Add Services || Akoode - Admin Panel",
  description: "Create a new services entry.",
};

export default function AddServicesPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Add New Services</h2>
          <p>Fill in the details below to create a new services entry.</p>
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_dashboard_review mb40">
          <div className="row">
            <div className="col-lg-12">
              <CreateList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
