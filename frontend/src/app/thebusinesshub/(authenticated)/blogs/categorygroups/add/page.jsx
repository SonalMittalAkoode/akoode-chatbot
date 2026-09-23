import CreateList from "./_components/CreateList";

export const metadata = {
  title: "Add Blog Category Group || Akoode - Admin Panel",
  description: "Create a new pill/section grouping for the public blog page.",
};

export default function AddBlogCategoryGroupPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Add Blog Category Group</h2>
          <p>Create a new pill and section grouping shown on the public blog page.</p>
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
