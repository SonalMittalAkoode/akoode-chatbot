import CaseStudyForm from "../_components/CaseStudyForm";

export const metadata = {
  title: "Add Case Study Latest || Akoode - Admin Panel",
  description: "Create a new latest case study detail page.",
};

export default function AddCaseStudyLatestPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Add Case Study Latest</h2>
          <p>Fill in the details below to create a new case study page. Toggle each section on/off as needed.</p>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="my_dashboard_review mb40">
          <div className="row">
            <div className="col-lg-12">
              <CaseStudyForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
