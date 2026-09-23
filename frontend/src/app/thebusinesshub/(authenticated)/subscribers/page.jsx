import SubscribersContent from "./_components/SubscribersContent";

export const metadata = {
  title: "Newsletter Subscribers || Akoode - Admin Panel",
  description: "Manage your email subscription list.",
};

export default function SubscribersPage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Newsletter Subscribers</h2>
          <p>Manage your email subscription list and newsletter audience.</p>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="my_dashboard_review mb40">
          <div className="property_table">
            <div className="table-responsive mt0">
              <SubscribersContent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
