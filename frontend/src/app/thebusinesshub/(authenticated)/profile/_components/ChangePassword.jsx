"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  adminChangeSubAdminPassword,
  changeOwnPassword,
  getSubAdmins,
} from "@/api/user";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [roleResolved, setRoleResolved] = useState(false);
  const [targetType, setTargetType] = useState("self"); // self | sub-admin
  const [subAdmins, setSubAdmins] = useState([]);
  const [targetSubAdmin, setTargetSubAdmin] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSubAdminPasswordUpdate = role === "admin" && targetType === "sub-admin";

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
    const currentRole = userData?.role || "";
    setRole(currentRole);
    if (currentRole === "sub-admin") {
      router.replace("/thebusinesshub/dashboard");
      setRoleResolved(true);
      return;
    }
    if (currentRole === "admin") {
      getSubAdmins()
        .then((list) => setSubAdmins(Array.isArray(list) ? list : []))
        .catch(() => setSubAdmins([]));
    }
    setRoleResolved(true);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === "sub-admin") {
      router.replace("/thebusinesshub/dashboard");
      return;
    }
    if (!isSubAdminPasswordUpdate && !currentPassword) {
      toast.error("Current password is required.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Confirm password does not match.");
      return;
    }
    if (role === "admin" && targetType === "sub-admin" && !targetSubAdmin) {
      toast.error("Please select a sub-admin.");
      return;
    }
    setLoading(true);
    try {
      if (isSubAdminPasswordUpdate) {
        await adminChangeSubAdminPassword(targetSubAdmin, newPassword);
        toast.success("Sub-admin password updated.");
        setTargetSubAdmin("");
      } else {
        await changeOwnPassword({ currentPassword, password: newPassword });
        toast.success("Password updated.");
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!roleResolved || role === "sub-admin" ? null : (
      <form onSubmit={handleSubmit}>
        {role === "admin" && (
          <div className="row mb1">
            <div className="col-lg-12">
              <div className="my_profile_setting_input form-group">
                <label className="d-block mb10">Update Password For</label>
                <div className="d-flex gap-3 align-items-center">
                  <label className="mb-0">
                    <input
                      type="radio"
                      name="passwordTarget"
                      value="self"
                      checked={targetType === "self"}
                      onChange={() => setTargetType("self")}
                    />{" "}
                    Self
                  </label>
                  <label className="mb-0">
                    <input
                      type="radio"
                      name="passwordTarget"
                      value="sub-admin"
                      checked={targetType === "sub-admin"}
                      onChange={() => setTargetType("sub-admin")}
                    />{" "}
                    Sub-admin
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {isSubAdminPasswordUpdate && (
          <div className="row">
            <div className="col-lg-6 col-xl-6">
              <div className="my_profile_setting_input form-group">
                <label htmlFor="subAdminSelect">Select Sub-admin</label>
                <select
                  id="subAdminSelect"
                  className="form-control"
                  value={targetSubAdmin}
                  onChange={(e) => setTargetSubAdmin(e.target.value)}
                >
                  <option value="">Select sub-admin</option>
                  {subAdmins.map((u) => (
                    <option key={u._id} value={u._id}>
                      {`${u.firstname || ""} ${u.lastname || ""}`.trim() || u.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {!isSubAdminPasswordUpdate && (
          <div className="row">
            <div className="col-lg-6 col-xl-6">
              <div className="my_profile_setting_input form-group">
                <label htmlFor="formGroupExampleCurrentPass">Current Password</label>
                <div className="position-relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    className="form-control pe-5"
                    id="formGroupExampleCurrentPass"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                    className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent text-[#5f6368] d-inline-flex align-items-center justify-content-center px-3"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-lg-6 col-xl-6">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="formGroupExampleNewPass">New Password</label>
              <div className="position-relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="form-control pe-5"
                  id="formGroupExampleNewPass"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                  className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent text-[#5f6368] d-inline-flex align-items-center justify-content-center px-3"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-xl-6">
            <div className="my_profile_setting_input form-group">
              <label htmlFor="formGroupExampleConfPass">Confirm New Password</label>
              <div className="position-relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control pe-5"
                  id="formGroupExampleConfPass"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent text-[#5f6368] d-inline-flex align-items-center justify-content-center px-3"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="col-xl-12">
            <div className="my_profile_setting_input float-end fn-520">
              <button type="submit" className="btn btn2" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      </form>
      )}
    </>
  );
};

export default ChangePassword;
