import CreateList from "./_components/CreateList";

export const metadata = {
  title: "Add Case Study || Akoode - Admin Panel",
  description: "Create a new casestudies entry.",
};

export default function AddCaseStudyPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Add New Case Study</h2>
          <p>Fill in the details below to create a new casestudies entry.</p>
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
