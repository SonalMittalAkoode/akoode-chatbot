type AdminLoginPayload = {
  email: string;
  password: string;
};

export const addAdminLoginAPI = async (payload: AdminLoginPayload) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_ADMIN_API_URL + "api/user/admin-login",
    {
      method: "POST",
      credentials: "include", // allow the server to set the httpOnly refreshToken cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to login admin");
  }

  return await response.json();
};

// True only when the backend confirms the token is valid (signed, unexpired,
// user still exists with an admin role). Throws on network failure so the
// caller can distinguish "invalid session" from "backend unreachable".
export const verifyAdminSessionAPI = async (token: string): Promise<boolean> => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_ADMIN_API_URL + "api/user/verify-session",
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );
  return response.ok;
};
