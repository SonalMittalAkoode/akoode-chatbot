import CreateList from "../_components/CreateList";

export const metadata = {
    title: "Edit Testimonial || Akoode - Admin Panel",
    description: "Update client testimonial.",
};

export default function EditTestimonialPage() {
    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="breadcrumb_content style2">
                    <h2 className="breadcrumb_title">Edit Testimonial</h2>
                    <p>Update client feedback and rating.</p>
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
