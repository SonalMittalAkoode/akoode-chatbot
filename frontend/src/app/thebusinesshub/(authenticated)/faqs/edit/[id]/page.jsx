import CreateList from "../_components/CreateList";

export const metadata = {
    title: "Edit FAQ || Akoode - Admin Panel",
    description: "Update frequently asked questions.",
};

export default function EditFaqPage() {
    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="breadcrumb_content style2">
                    <h2 className="breadcrumb_title">Edit FAQ</h2>
                    <p>Update FAQ question and answer content.</p>
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
