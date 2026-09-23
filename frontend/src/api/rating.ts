export const addRatingAPI = async (ratingData: {
  title: string;
  value: string;
  suffix?: string;
  order?: number;
  status?: boolean;
}) => {
  const userDataStr = sessionStorage.getItem("user");
  if (!userDataStr) {
    throw new Error("User not authenticated!");
  }
  const userData = JSON.parse(userDataStr);
  const token = userData?.token;

  if (!token) {
    throw new Error("User not authenticated!");
  }

  const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
  const response = await fetch(apiUrl + "api/rating", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ratingData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add Rating");
  }

  return response.json();
};

export const updateRatingAPI = async (
  id: string,
  ratingData: {
    title?: string;
    value?: string;
    suffix?: string;
    order?: number;
    status?: boolean;
  }
) => {
  const userDataStr = sessionStorage.getItem("user");
  if (!userDataStr) {
    throw new Error("User not authenticated!");
  }
  const userData = JSON.parse(userDataStr);
  const token = userData?.token;

  if (!token) {
    throw new Error("User not authenticated!");
  }

  const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
  const response = await fetch(apiUrl + `api/rating/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ratingData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update Rating");
  }

  return response.json();
};

export const deleteRatingAPI = async (id: string) => {
  const userDataStr = sessionStorage.getItem("user");
  if (!userDataStr) {
    throw new Error("User not authenticated!");
  }
  const userData = JSON.parse(userDataStr);
  const token = userData?.token;

  if (!token) {
    throw new Error("User not authenticated!");
  }

  const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
  const response = await fetch(apiUrl + `api/rating/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete Rating");
  }

  return response.json();
};

export const getRatingById = async (id: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
  const response = await fetch(apiUrl + `api/rating/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch Rating");
  }

  const data = await response.json();
  // Handle both wrapped and unwrapped responses
  if (data.status === 'success' && data.data) {
    return data;
  }
  // If data is the rating object directly
  return { status: 'success', data: data };
};

export async function getRatingTableData() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || "";
    const response = await fetch(apiUrl + "api/rating");

    if (!response.ok) {
      throw new Error("Failed to fetch ratings");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return [];
  }
}

