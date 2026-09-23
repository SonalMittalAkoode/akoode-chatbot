import CreateList from "../_components/CreateList";

export const metadata = {
    title: "Edit Job || Akoode - Admin Panel",
    description: "Update job posting details.",
};

export default function EditJobPage() {
    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="breadcrumb_content style2">
                    <h2 className="breadcrumb_title">Edit Job</h2>
                    <p>Update job requirements, description, and status.</p>
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
