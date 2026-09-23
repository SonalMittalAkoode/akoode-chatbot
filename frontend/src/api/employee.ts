export const addEmployeeAPI = async (employeeData: FormData | { name: string; designation: string; email: string; status?: boolean }) => {
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
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };
    
    // Only set Content-Type for JSON, not for FormData (browser will set it with boundary)
    if (!(employeeData instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    
    const response = await fetch(apiUrl + "api/employee", {
      method: "POST",
      headers,
      body: employeeData instanceof FormData ? employeeData : JSON.stringify(employeeData),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add Employee");
    }
  
    return response.json();
  };
  
type EmployeeTableFilter = {
  limit: number;
  page: number;
};


  export async function getEmployeeTableData() {
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
      const response = await fetch(apiUrl + "api/employee", {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      
      const data = await response.json();
      // Handle both array response and object with data property
      return Array.isArray(data) ? data : (data.data || data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      return []; // Return an empty array in case of an error
    }
  }

  export async function getEmployeeTableDataPaginated(
    filter: EmployeeTableFilter
  ): Promise<{ items: any[]; totalCount: number }> {
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
      const response = await fetch(
        apiUrl + `api/employee?limit=${filter.limit}&page=${filter.page}`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      return {
        items: Array.isArray(data?.items) ? data.items : [],
        totalCount: data?.totalCount ?? 0,
      };
    } catch (error) {
      console.error("Error fetching employees:", error);
      return { items: [], totalCount: 0 };
    }
  }


  export const deleteEmployeeAPI = async (id: string) => {
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
    const response = await fetch(apiUrl + `api/employee/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete Employee");
    }
  
    return response.json();
  };


  
  

  export const getEmployeeById = async (id: string) => {
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
    const response = await fetch(apiUrl + `api/employee/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // body: JSON.stringify({ id }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get Employee");
    }
  
    return response.json();
  };


  export const updateEmployeeAPI = async (id: string, employeeData: FormData | { name: string; designation: string; email: string; status: boolean }) => {
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
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    };
    
    // Only set Content-Type for JSON, not for FormData (browser will set it with boundary)
    if (!(employeeData instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    
    const response = await fetch(apiUrl + `api/employee/${id}`, {
      method: "PUT",
      headers,
      body: employeeData instanceof FormData ? employeeData : JSON.stringify(employeeData),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update Employee");
    }
  
    return response.json();
  };