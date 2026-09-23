import CreateList from "./_components/CreateList";

export const metadata = {
  title: "Add Blog || Akoode - Admin Panel",
  description: "Create a new blog post.",
};

export default function AddBlogPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Add New Blog</h2>
          <p>Fill in the details below to publish a new blog post.</p>
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
