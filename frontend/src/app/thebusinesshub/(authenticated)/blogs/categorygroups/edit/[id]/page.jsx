import CreateList from "../_components/CreateList";

export const metadata = {
  title: "Edit Blog Category Group || Akoode - Admin Panel",
  description: "Update a pill/section grouping shown on the public blog page.",
};

export default function EditBlogCategoryGroupPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Edit Blog Category Group</h2>
          <p>Update the pill and section details shown on the public blog page.</p>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-12">
        <div className="my_dashboard_review mb40">
          <div className="row">
            <div className="col-lg-12">
              <CreateList />
            </div>
          </div>
        </div>
      </div>
      {/* End .col */}
    </div>
  );
}
