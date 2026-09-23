const getAuthToken = () => {
  const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
  return userData?.token;
};

export const ADMIN_API_BASE =
  process.env.NEXT_PUBLIC_ADMIN_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
  "http://localhost:5000/";

export const buildAdminUrl = (path: string) => {
  const trimmedBase = ADMIN_API_BASE.replace(/\/$/, "");
  const trimmedPath = path.replace(/^\/+/, "");
  return `${trimmedBase}/${trimmedPath}`;
};

const FRONTEND_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
  "http://localhost:5000/";

const buildFrontendUrl = (path: string) => {
  const trimmedBase = FRONTEND_API_BASE.replace(/\/$/, "");
  const trimmedPath = path.replace(/^\/+/, "");
  return `${trimmedBase}/${trimmedPath}`;
};

export async function submitJobApplication(formData: FormData) {
  const response = await fetch(
    buildFrontendUrl("frontend/api/jobapplication/apply"),
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to submit application");
  }

  return response.json();
}

export async function getJobApplications(filter = { limit: 10, page: 1 }) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("User not authenticated!");
  }

  const params = new URLSearchParams();
  params.append("limit", String(filter.limit ?? 10));
  params.append("page", String(filter.page ?? 1));

  const response = await fetch(
    `${buildAdminUrl("api/jobapplication/applications")}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch job applications");
  }

  return response.json();
}

export const deleteJobApplication = async (id: string) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("User not authenticated!");
  }

  const response = await fetch(
    buildAdminUrl(`api/jobapplication/applications/${id}`),
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to delete application");
  }

  return response.json();
};

export const getJobApplicationResumeUrl = (id: string) =>
  buildAdminUrl(`api/jobapplication/applications/${id}/resume`);


