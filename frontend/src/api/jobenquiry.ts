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

export const addJobEnquiryAPI = async (title: string) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("User not authenticated!");
  }

  

  const response = await fetch(buildAdminUrl("api/jobenquiry"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (!response.status) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add JobEnquiry");
  }

  return response.json();
};


export async function getJobEnquiryTableData(filter = { limit: 10, page: 1 }) {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const token = getAuthToken();
  if (!token) {
    throw new Error("User not authenticated!");
  }

  const params = new URLSearchParams();
  params.append("limit", String(filter.limit ?? 10));
  params.append("page", String(filter.page ?? 1));

  try {
    const response = await fetch(
    `${buildAdminUrl("api/jobenquiry/enquiries")}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 60 }
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch job enquiries");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching job enquiries:", error);
    return { items: [], totalCount: 0 };
  }
}


export const deleteJobEnquiryAPI = async (id: string) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("User not authenticated!");
  }

  const response = await fetch(
    buildAdminUrl(`api/jobenquiry/enquiries/${id}`),
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete JobEnquiry");
  }

  return response.json();
};





export const getJobEnquiryById = async (id: string) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("User not authenticated!");
  }

  const response = await fetch(buildAdminUrl(`api/jobenquiry/${id}`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get JobEnquiry");
  }

  return response.json();
};


export const updateJobEnquiryAPI = async (
  id: string,
  jobenquiry: Record<string, unknown>
) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("User not authenticated!");
  }

  const response = await fetch(buildAdminUrl(`api/jobenquiry/${id}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobenquiry),
  });

  if (!response.status) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add JobEnquiry");
  }

  return response.json();
};