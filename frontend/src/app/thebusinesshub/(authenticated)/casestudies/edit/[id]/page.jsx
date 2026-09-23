import CreateList from "../_components/CreateList";

export const metadata = {
    title: "Edit Case Study || Akoode - Admin Panel",
    description: "Update your case study content.",
};

export default function EditCasestudyPage() {
    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="breadcrumb_content style2">
                    <h2 className="breadcrumb_title">Edit Case Study</h2>
                    <p>
                        Update your case study details, images, and process steps.
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
