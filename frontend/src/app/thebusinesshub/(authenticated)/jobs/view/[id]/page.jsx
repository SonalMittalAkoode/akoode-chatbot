import JobView from "../_components/index";

export const metadata = {
    title: "View Job Details || Akoode - Admin Panel",
    description: "Detailed view of a job posting.",
};

export default function ViewJobPage() {
    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="breadcrumb_content style2">
                    <h2 className="breadcrumb_title">Job Details</h2>
                    <p>View complete information for this job posting.</p>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="my_dashboard_review mb40">
                    <JobView />
                </div>
            </div>
        </div>
    );
}
