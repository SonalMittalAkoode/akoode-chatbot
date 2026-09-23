import CreateList from "../_components/CreateList";

export const metadata = {
    title: "Edit Video Testimonial || Akoode - Admin Panel",
    description: "Update video testimonial content.",
};

export default function EditVideoTestimonialPage() {
    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="breadcrumb_content style2">
                    <h2 className="breadcrumb_title">Edit Video Testimonial</h2>
                    <p>Update video URL and client details.</p>
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
