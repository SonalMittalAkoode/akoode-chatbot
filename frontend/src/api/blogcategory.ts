export const addBlogcategoryAPI = async (title: string) => {
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
 
  const token =userData.token
  
    
      if (!token) {
        throw new Error("User not authenticated!");
      }
    
      const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+"api/blogcategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });
    
      if (!response.status) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add blogcategory");
      }
    
      return response.json();
    };
    
  
    export async function getBlogcategoryTableData() {
      // Fake delay
      await new Promise((resolve) => setTimeout(resolve, 10));
      
    
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+"api/blogcategory"); // Replace with actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching products:", error);
        return []; // Return an empty array in case of an error
      }
    }
  
  
    export const deleteBlogcategoryAPI = async (id: string) => {
      const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
  
  const token =userData.token
      if (!token) {
        throw new Error("User not authenticated!");
      }
    
      const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+`api/blogcategory/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete blogcategory");
      }
    
      return response.json();
    };
  
  
    
    
  
    export const getBlogcategoryById = async (id: string) => {
      const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
  
  const token =userData.token
      if (!token) {
        throw new Error("User not authenticated!");
      }
    
      const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+`api/blogcategory/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify({ id }),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get blogcategory");
      }
    
      return response.json();
    };
  
  
    export const updateBlogcategoryAPI = async (id: any, blogcategory: any) => {
      const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const token =userData.token
  
    
      if (!token) {
        throw new Error("User not authenticated!");
      }
    
      const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+`api/blogcategory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blogcategory),
      });
    
      if (!response.status) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add blogcategory");
      }
    
      return response.json();
    };
