import CreateList from "./_components/CreateList";

export const metadata = {
  title: "Add Video Testimonial || Akoode - Admin Panel",
  description: "Upload a new client video testimonial.",
};

export default function AddVideoPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Add Video Testimonial</h2>
          <p>Provide the details below to upload a new video testimonial.</p>
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
