import CreateList from "../_components/CreateList";

export const metadata = {
    title: "Edit Blog || Akoode - Admin Panel",
    description: "Update your blog content.",
};

export default function EditBlogPage() {
    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="breadcrumb_content style2">
                    <h2 className="breadcrumb_title">Edit Blog Post</h2>
                    <p>
                        Update your blog content, images, tags, or categories to keep your
                        articles fresh and relevant.
                    </p>
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
