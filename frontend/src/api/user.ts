const getToken = () => {
  const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
  return userData?.token;
};

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_ADMIN_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/";

export const logoutAdminUser = async () => {
  try {
    await fetch(getBaseUrl() + "api/user/logout", {
      method: "GET",
      credentials: "include", // send httpOnly refreshToken cookie so the server can clear it
    });
  } catch (_e) {
    // Ignore network logout failure; local cleanup still happens
  }
};

export const changeOwnPassword = async (payload: { currentPassword?: string; password: string }) => {
  const token = getToken();
  if (!token) throw new Error("User not authenticated!");

  const response = await fetch(getBaseUrl() + "api/user/password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || "Failed to update password");
  }
  return data;
};

export const getSubAdmins = async () => {
  const token = getToken();
  if (!token) throw new Error("User not authenticated!");

  const response = await fetch(getBaseUrl() + "api/user/sub-admins", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || "Failed to load sub-admin list");
  return data?.data || [];
};

export const adminChangeSubAdminPassword = async (id: string, password: string) => {
  const token = getToken();
  if (!token) throw new Error("User not authenticated!");

  const response = await fetch(getBaseUrl() + `api/user/admin/change-password/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || "Failed to update sub-admin password");
  return data;
};
