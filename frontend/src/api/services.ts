// api/services.ts

type ServicesFilter = {
  limit: number;
  page: number;
  q?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "";

// Helper to safely get auth token from localStorage (client-side only)
const getAuthToken = (): string => {
  if (typeof window === "undefined") {
    throw new Error("LocalStorage is not available on the server.");
  }

  const storedUser = sessionStorage.getItem("user");
  if (!storedUser) {
    throw new Error("User not authenticated!");
  }

  let userData: any;
  try {
    userData = JSON.parse(storedUser);
  } catch {
    throw new Error("Invalid user data in storage!");
  }

  const token = userData?.token as string | undefined;
  if (!token) {
    throw new Error("User not authenticated!");
  }

  return token;
};

// ADD SERVICE
export const addServicesAPI = async (formData: FormData): Promise<any> => {
  const token = getAuthToken();

  const response = await fetch(`${BASE_URL}api/services`, {
    method: "POST",
    headers: {
      // "Content-Type": "multipart/form-data", // let browser set this for FormData
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add Services");
  }

  return response.json();
};

// GET SERVICES TABLE DATA
export async function getServicesTableData(
  filter: ServicesFilter
): Promise<{ items: any[]; totalCount: number }> {
  try {
    const searchQ = filter.q ? `&q=${encodeURIComponent(filter.q)}` : "";
    const response = await fetch(
      `${BASE_URL}api/services?limit=${filter.limit}&page=${filter.page}${searchQ}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }

    return (await response.json()) as { items: any[]; totalCount: number };
  } catch (error) {
    console.error("Error fetching services:", error);
    return { items: [], totalCount: 0 };
  }
}

// DELETE SERVICE
export const deleteServicesAPI = async (id: string): Promise<any> => {
  const token = getAuthToken();

  const response = await fetch(`${BASE_URL}api/services/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete Services");
  }

  return response.json();
};

// GET SERVICE BY ID
export const getServicesById = async (id: string): Promise<any> => {
  const token = getAuthToken();

  const response = await fetch(`${BASE_URL}api/services/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to get Services");
  }

  return response.json();
};

// UPDATE SERVICE
export const updateServicesAPI = async (
  id: string,
  services: FormData
): Promise<any> => {
  const token = getAuthToken();

  const response = await fetch(`${BASE_URL}api/services/${id}`, {
    method: "PUT",
    headers: {
      // "Content-Type": "multipart/form-data", // let browser set this for FormData
      Authorization: `Bearer ${token}`,
    },
    body: services,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update Services");
  }

  return response.json();
};
