// api/industry.ts — admin CMS calls for industry pages

type IndustryFilter = {
  limit: number;
  page: number;
  q?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "";

const getAuthToken = (): string => {
  if (typeof window === "undefined") {
    throw new Error("LocalStorage is not available on the server.");
  }
  const storedUser = sessionStorage.getItem("user");
  if (!storedUser) throw new Error("User not authenticated!");
  let userData: any;
  try {
    userData = JSON.parse(storedUser);
  } catch {
    throw new Error("Invalid user data in storage!");
  }
  const token = userData?.token as string | undefined;
  if (!token) throw new Error("User not authenticated!");
  return token;
};

export async function getIndustryTableData(
  filter: IndustryFilter
): Promise<{ items: any[]; totalCount: number }> {
  try {
    const searchQ = filter.q ? `&q=${encodeURIComponent(filter.q)}` : "";
    const response = await fetch(
      `${BASE_URL}api/industry?limit=${filter.limit}&page=${filter.page}${searchQ}`
    );
    if (!response.ok) throw new Error("Failed to fetch industries");
    return (await response.json()) as { items: any[]; totalCount: number };
  } catch (error) {
    console.error("Error fetching industries:", error);
    return { items: [], totalCount: 0 };
  }
}

export const addIndustryAPI = async (payload: Record<string, any>): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/industry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add industry");
  }
  return response.json();
};

export const updateIndustryAPI = async (id: string, payload: Record<string, any>): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/industry/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update industry");
  }
  return response.json();
};

export const deleteIndustryAPI = async (id: string): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/industry/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete industry");
  }
  return response.json();
};

export const togglePublishIndustryAPI = async (id: string): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/industry/${id}/toggle-publish`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to toggle publish status");
  }
  return response.json();
};

export const getIndustryById = async (id: string): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/industry/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to get industry");
  }
  return response.json();
};
