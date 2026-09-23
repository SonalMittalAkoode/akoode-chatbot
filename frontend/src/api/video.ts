export const addVideoAPI = async (videoData: FormData) => {
  const userDataStr = sessionStorage.getItem("user");
  if (!userDataStr) {
    throw new Error("User not authenticated!");
  }
  const userData = JSON.parse(userDataStr);
  const token = userData?.token;

  if (!token) {
    throw new Error("User not authenticated!");
  }

  const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
  const response = await fetch(apiUrl + "api/video", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: videoData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add Video");
  }

  return response.json();
};

export async function getVideoTableData() {
  try {
    const userDataStr = sessionStorage.getItem("user");
    let token = null;
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      token = userData?.token;
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
    const response = await fetch(apiUrl + "api/video", {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch videos");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : (data.data || data);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

export const deleteVideoAPI = async (id: string) => {
  const userDataStr = sessionStorage.getItem("user");
  if (!userDataStr) {
    throw new Error("User not authenticated!");
  }
  const userData = JSON.parse(userDataStr);
  const token = userData?.token;
  if (!token) {
    throw new Error("User not authenticated!");
  }

  const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
  const response = await fetch(apiUrl + `api/video/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete Video");
  }

  return response.json();
};

export const getVideoById = async (id: string) => {
  const userDataStr = sessionStorage.getItem("user");
  if (!userDataStr) {
    throw new Error("User not authenticated!");
  }
  const userData = JSON.parse(userDataStr);
  const token = userData?.token;
  if (!token) {
    throw new Error("User not authenticated!");
  }

  const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
  const response = await fetch(apiUrl + `api/video/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get Video");
  }

  return response.json();
};

export const updateVideoAPI = async (id: string, videoData: FormData) => {
  const userDataStr = sessionStorage.getItem("user");
  if (!userDataStr) {
    throw new Error("User not authenticated!");
  }
  const userData = JSON.parse(userDataStr);
  const token = userData?.token;

  if (!token) {
    throw new Error("User not authenticated!");
  }

  const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
  const response = await fetch(apiUrl + `api/video/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: videoData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update Video");
  }

  return response.json();
};

