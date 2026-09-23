import CreateList from "./_components/CreateList";

export const metadata = {
  title: "Add Life || Akoode - Admin Panel",
  description: "Create a new life entry.",
};

export default function AddLifePage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Add New Life</h2>
          <p>Fill in the details below to create a new life entry.</p>
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
