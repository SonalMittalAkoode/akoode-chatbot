import ChangePassword from "./_components/ChangePassword";

export const metadata = {
  title: "My Profile || Akoode - Admin Panel",
  description: "Manage your administrator profile.",
};

export default function ProfilePage() {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="breadcrumb_content style2">
          <h2 className="breadcrumb_title">Change Password</h2>
          <p>Update account password settings.</p>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="my_dashboard_review mb40">
          <div className="row">
            <div id="change-password" className="col-lg-12  scroll-mt-28">
              <ChangePassword />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
