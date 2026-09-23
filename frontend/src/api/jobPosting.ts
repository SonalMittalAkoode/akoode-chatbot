const BASE_URL = `${process.env.NEXT_PUBLIC_ADMIN_API_URL}api/jobposting`;

const getToken = (): string => {
  const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const token = userData.token;
  if (!token) throw new Error("User not authenticated!");
  return token;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || errorData?.message || "Failed to complete request");
  }

  return response.json();
};

export const getJobPostings = async ({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number;
  limit?: number;
  status?: "active" | "inactive";
} = {}) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (status) params.set("status", status);

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  return handleResponse(response);
};

export const getJobPostingById = async (id: string) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const addJobPosting = async (payload: Record<string, unknown>) => {
  const token = getToken();
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const updateJobPosting = async (id: string, payload: Record<string, unknown>) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const deleteJobPosting = async (id: string) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};
