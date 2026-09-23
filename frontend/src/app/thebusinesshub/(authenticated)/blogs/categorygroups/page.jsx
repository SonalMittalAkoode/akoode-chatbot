import TableData from "./_components/TableData";

export const metadata = {
  title: "Blog Category Groups || Akoode - Admin Panel",
  description: "Manage the pill nav / section groupings shown on the public blog page.",
};

export default function MyBlogCategoryGroupPage() {
  return (
    <div className="row">
      <div className="col-lg-4 col-xl-4 mb10">
        <div className="breadcrumb_content style2 mb30-991">
          <h2 className="breadcrumb_title">Blog Category Groups</h2>
          <p>Manage the header pills and sections shown on the public blog page.</p>
        </div>
      </div>
      {/* End .col */}
      <div className="col-lg-8 col-xl-8">
        <div className="candidate_revew_select style2 text-end mb30-991">
          <ul className="mb0">
            {/* Filters/Search can be added here if needed */}
          </ul>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-12">
        <div className="my_dashboard_review mb40">
          <div className="property_table">
            <div className="table-responsive mt0">
              <TableData />
            </div>
          </div>
        </div>
      </div>
      {/* End .col */}
    </div>
  );
}
