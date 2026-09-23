export const addBlogCategoryGroupAPI = async (group: any) => {
  const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const token = userData.token;

  if (!token) {
    throw new Error("User not authenticated!");
  }

  const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL + "api/blogcategorygroup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(group),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add category group");
  }

  return response.json();
};

export async function getBlogCategoryGroupTableData() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL + "api/blogcategorygroup");
    if (!response.ok) {
      throw new Error("Failed to fetch category groups");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching category groups:", error);
    return [];
  }
}

export const deleteBlogCategoryGroupAPI = async (id: string) => {
  const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const token = userData.token;
  if (!token) {
    throw new Error("User not authenticated!");
  }

  const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL + `api/blogcategorygroup/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete category group");
  }

  return response.json();
};

export const getBlogCategoryGroupById = async (id: string) => {
  const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const token = userData.token;
  if (!token) {
    throw new Error("User not authenticated!");
  }

  const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL + `api/blogcategorygroup/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get category group");
  }

  return response.json();
};

export const updateBlogCategoryGroupAPI = async (id: any, group: any) => {
  const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const token = userData.token;

  if (!token) {
    throw new Error("User not authenticated!");
  }

  const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL + `api/blogcategorygroup/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(group),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update category group");
  }

  return response.json();
};
