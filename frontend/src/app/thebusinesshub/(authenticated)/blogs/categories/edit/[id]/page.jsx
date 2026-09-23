import CreateList from "../_components/CreateList";

export const metadata = {
    title: "Edit Blog Category || Akoode - Admin Panel",
    description: "Update your blog category.",
};

export default function EditBlogcategoryPage() {
    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="breadcrumb_content style2">
                    <h2 className="breadcrumb_title">Edit Blog Category</h2>
                    <p>Update category details to refine your blog organization.</p>
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
