import CreateList from "../_components/CreateList";

export const metadata = {
    title: "Edit Employee || Akoode - Admin Panel",
    description: "Update employee details.",
};

export default function EditEmployeePage() {
    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="breadcrumb_content style2">
                    <h2 className="breadcrumb_title">Edit Employee</h2>
                    <p>Update employee profile and position details.</p>
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
