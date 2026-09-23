import TableData from "./_components/TableData";

export const metadata = {
  title: "Service By Country || Akoode - Admin Panel",
  description: "Manage all service-by-country landing pages.",
};

export default function SBCListPage() {
  return (
    <div className="row">
      <div className="col-lg-4 col-xl-4 mb10">
        <div className="breadcrumb_content style2 mb30-991">
          <h2 className="breadcrumb_title">Service By Country Pages</h2>
          <p>View, edit, and manage country/market landing pages.</p>
        </div>
      </div>
      <div className="col-lg-8 col-xl-8">
        <div className="candidate_revew_select style2 text-end mb30-991">
          <ul className="mb0">
            <li className="list-inline-item">
              <a href="/thebusinesshub/service-by-country/add" className="btn btn2">
                + Add New
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="my_dashboard_review mb40">
          <div className="property_table">
            <div className="table-responsive mt0">
              <TableData />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
