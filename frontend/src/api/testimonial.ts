// export const addTestimonialAPI = async (formData: any) => {
//   const response = await axios.post("/your-api-endpoint", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return response.data;
// };

export const addTestimonialAPI = async (formData: any) => {
    // const token = localStorage.getItem("token"); // 🔹 Retrieve token
// console.log("token")
    // const token =process.env.NEXT_PUBLIC_TOKEN;
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
console.log(userData.name);
// const token = localStorage.getItem("token"); // 🔹 Retrieve token
// // console.log("token")
//     const token =process.env.NEXT_PUBLIC_TOKEN;
const token =userData.token

  
    if (!token) {
      throw new Error("User not authenticated!");
    }
//     console.log("formDataapi")
//     console.log(formData)
//     for (let [key, value] of formData.entries()) {
//       console.log(`${key}:`, value);
//     }
// console.log("formDataendapi")
    const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+"api/testimonial", {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData
    });
  
    if (!response.status) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add testimonial");
    }
  
    return response.json();
  };
  

  export async function getTestimonialTableData() {
    // Fake delay
    await new Promise((resolve) => setTimeout(resolve, 10));
    
  
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+"api/testimonial"); // Replace with actual API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      return []; // Return an empty array in case of an error
    }
  }


  export const deleteTestimonialAPI = async (id: string) => {
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
const token =userData.token
    if (!token) {
      throw new Error("User not authenticated!");
    }
  
    const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+`api/testimonial/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete testimonial");
    }
  
    return response.json();
  };


  
  

  export const getTestimonialById = async (id: string) => {
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
const token =userData.token
    if (!token) {
      throw new Error("User not authenticated!");
    }
  
    const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+`api/testimonial/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // body: JSON.stringify({ id }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get testimonial");
    }
  
    return response.json();
  };


  export const updateTestimonialAPI = async (id: any, testimonial: any) => {
    
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
const token =userData.token

  
    if (!token) {
      throw new Error("User not authenticated!");
    }
    
    const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+`api/testimonial/${id}`, {
      method: "PUT",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: testimonial,
    });
  
    if (!response.status) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add testimonial");
    }
  
    return response.json();
  };
