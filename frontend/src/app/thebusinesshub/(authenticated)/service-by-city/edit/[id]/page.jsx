import CreateList from "../_components/CreateList";

export const metadata = {
  title: "Edit Service By City || Akoode - Admin Panel",
  description: "Edit an existing service-by-city landing page.",
};

export default function EditSBCCityPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Edit Service By City Page</h2>
          <p>Update the details for this city landing page.</p>
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
