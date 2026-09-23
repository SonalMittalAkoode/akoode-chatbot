import CreateList from "../_components/CreateList";

export const metadata = {
  title: "Edit Service || Akoode - Admin Panel",
  description: "Update your service entry.",
};

export default function EditServicePage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Edit Service</h2>
          <p>
            Update your service details, images, or content to keep your listings
            fresh and accurate.
          </p>
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
