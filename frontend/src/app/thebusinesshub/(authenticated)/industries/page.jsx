import IndustryTableData from "./_components/TableData";

export const metadata = {
  title: "Industries || Akoode - Admin Panel",
  description: "Manage all industry landing pages.",
};

export default function IndustryListPage() {
  return (
    <div className="row">
      <div className="col-lg-4 col-xl-4 mb10">
        <div className="breadcrumb_content style2 mb30-991">
          <h2 className="breadcrumb_title">Industry Pages</h2>
          <p>View, edit, and manage industry landing pages.</p>
        </div>
      </div>
      <div className="col-lg-8 col-xl-8">
        <div className="candidate_revew_select style2 text-end mb30-991">
          <ul className="mb0">
            <li className="list-inline-item">
              <a href="/thebusinesshub/industries/add" className="btn btn2">
                + Add Industry
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="my_dashboard_review mb40">
          <div className="property_table">
            <div className="table-responsive mt0">
              <IndustryTableData />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
