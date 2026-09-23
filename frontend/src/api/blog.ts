// export const addBlogAPI = async (formData: any) => {
//   const response = await axios.post("/your-api-endpoint", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// };

export const addBlogAPI = async (formData: any) => {
    
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");

const token =userData.token

  
    if (!token) {
      throw new Error("User not authenticated!");
    }

    const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+"api/blog", {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData
    });
  
    if (!response.status) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add Blog");
    }
  
    return response.json();
  };
  

  export async function getBlogTableData(filter: { limit?: number; page?: number; q?: string } = {}) {
    // Fake delay
    await new Promise((resolve) => setTimeout(resolve, 10));
    
  
    try {
      const limit = filter.limit ?? 10;
      const page = filter.page ?? 1;
      const q = filter.q ? `&q=${encodeURIComponent(filter.q)}` : "";
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMIN_API_URL + `api/blog?limit=${limit}&page=${page}${q}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      return { items: [], totalCount: 0 }; // Return safe empty result in case of an error
    }
  }


  export const deleteBlogAPI = async (id: string) => {
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
    const token = userData.token;
    
    if (!token) {
      throw new Error("User not authenticated!");
    }
  
    const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL + `api/blog/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to delete Blog" }));
      throw new Error(errorData.message || "Failed to delete Blog");
    }
  
    return response.json();
  };


  
  

  export const getBlogById = async (id: string) => {
    
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
const token =userData.token
    if (!token) {
      throw new Error("User not authenticated!");
    }
  
    const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+`api/blog/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // body: JSON.stringify({ id }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get Blog");
    }
  
    return response.json();
  };


  export const updateBlogAPI = async (id: any, blog: any) => {
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
const token =userData.token

  
    if (!token) {
      throw new Error("User not authenticated!");
    }
 
    const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+`api/blog/${id}`, {
      method: "PUT",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: blog,
    });

    if (!response.status) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add Blog");
    }

    return response.json();
  };

const withTrailingSlash = (v: string) => (v && !v.endsWith("/") ? `${v}/` : v);

const resolveFrontendBase = () => {
  const base = process.env.NEXT_PUBLIC_FRONTEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "";
  if (typeof window === "undefined" && base.startsWith("/")) {
    const backendBase = process.env.LOCAL_BACKEND_URL || "http://localhost:5005";
    return `${backendBase}/frontend/`;
  }
  return withTrailingSlash(base);
};

export async function getBlogBySlug(slug: string): Promise<any> {
  const base = resolveFrontendBase();
  if (!base || !slug) return null;
  try {
    const res = await fetch(`${base}api/blog/slug/${slug}`, {
      next: { revalidate: 3600, tags: [`blog-${slug}`] },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}
