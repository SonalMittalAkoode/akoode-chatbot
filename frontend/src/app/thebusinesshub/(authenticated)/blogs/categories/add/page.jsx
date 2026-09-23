import CreateList from "./_components/CreateList";

export const metadata = {
  title: "Add Blog Category || Akoode - Admin Panel",
  description: "Create a new blog category.",
};

export default function AddBlogcategoryPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Add Blog Category</h2>
          <p>Create a new category to organize your blog posts effectively.</p>
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
