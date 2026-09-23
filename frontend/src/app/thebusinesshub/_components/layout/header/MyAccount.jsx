'use client'

import Link from "next/link";
import { isSinglePageActive } from "@/utils/daynamicNavigation";
import { usePathname } from "next/navigation";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/utils/useAuth";
import { logoutAdminUser } from "@/api/user";
import { toast } from "react-toastify";

const MyAccount = () => {
  useAuth();
  const router = useRouter();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
    setUserRole(userData?.role || "");
  }, []);

  const handleLogout = async () => {
    await logoutAdminUser();
    sessionStorage.removeItem('user');
    localStorage.removeItem('adminRememberMe');
    router.push('/thebusinesshub');
  };

  const handleChangePassword = (e) => {
    const currentRole =
      userRole || JSON.parse(sessionStorage.getItem("user") || "{}")?.role || "";
    if (currentRole === "sub-admin") {
      e.preventDefault();
      toast.warning("You are not allowed to change password.");
    }
  };

  const pathname = usePathname()
  const profileMenuItems = [
    { id: 1, name: "Change Password", ruterPath: "/thebusinesshub/profile#change-password" },
  ];
  return (
    <>
      <div className="user_setting_content">
        {profileMenuItems.map((item) => (
          <Link
            href={item.ruterPath}
            key={item.id}
            className="dropdown-item"
            onClick={handleChangePassword}
            style={
              isSinglePageActive(`${item.ruterPath}`, pathname)
                ? { color: "#ff5a5f" }
                : undefined
            }
          >
            {item.name}
          </Link>
        ))}
        
            <a
              className="dropdown-item"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              Log out
            </a>
          

      </div>
    </>
  );
};

export default MyAccount;
