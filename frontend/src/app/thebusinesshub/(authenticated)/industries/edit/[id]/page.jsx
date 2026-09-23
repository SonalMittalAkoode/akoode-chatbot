import CreateList from "../../_components/CreateList";

export const metadata = {
  title: "Edit Industry || Akoode - Admin Panel",
  description: "Edit an existing industry landing page.",
};

export default function EditIndustryPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Edit Industry Page</h2>
          <p>Update the details for this industry landing page.</p>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="my_dashboard_review mb40">
          <div className="row">
            <div className="col-lg-12">
              <CreateList mode="edit" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
