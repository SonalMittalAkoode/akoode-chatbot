import CreateList from "../_components/CreateList";

export const metadata = {
    title: "Edit Life at Akoode || Akoode - Admin Panel",
    description: "Update life at akoode gallery content.",
};

export default function EditLifePage() {
    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="breadcrumb_content style2">
                    <h2 className="breadcrumb_title">Edit Life at Akoode</h2>
                    <p>Update gallery images and titles.</p>
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
