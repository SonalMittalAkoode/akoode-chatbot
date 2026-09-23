export const addEnquiryAPI = async (title: string) => {
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
const token =userData.token

  
    if (!token) {
      throw new Error("User not authenticated!");
    }
  
    const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+"api/enquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });
  
    if (!response.status) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add Enquiry");
    }
  
    return response.json();
  };
  

  export async function getEnquiryTableData(filter: { limit?: number; page?: number; source?: string } = {}) {
    await new Promise((resolve) => setTimeout(resolve, 10));

    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
    const token = userData?.token;
    if (!token) {
      throw new Error("User not authenticated!");
    }

    try {
      const params = new URLSearchParams({
        limit: String(filter.limit ?? 10),
        skip: String(filter.page ?? 1),
      });
      if (filter.source) params.set("source", filter.source);
      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMIN_API_URL + "api/enquiry?" + params.toString(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 403) {
        // Sub-admin has no enquiry listing access by design
        return { items: [], totalCount: 0 };
      }
      if (!response.ok) {
        throw new Error("Failed to fetch enquiry data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching enquiry data:", error);
      return { items: [], totalCount: 0 };
    }
  }

  export async function getEnquiryDashboardStats(filter: { period?: string; type?: string; startDate?: string; endDate?: string } = {}) {
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
    const token = userData?.token;
    if (!token) {
      throw new Error("User not authenticated!");
    }

    try {
      const params = new URLSearchParams();
      if (filter.period) params.set("period", filter.period);
      if (filter.type) params.set("type", filter.type);
      if (filter.startDate) params.set("startDate", filter.startDate);
      if (filter.endDate) params.set("endDate", filter.endDate);

      const response = await fetch(
        process.env.NEXT_PUBLIC_ADMIN_API_URL + "api/enquiry/stats?" + params.toString(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch enquiry statistics");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching enquiry statistics:", error);
      return { labels: [], datasets: [] };
    }
  }

  export async function getEnquiryDashboardCount(type: string = "all") {
    const stats = await getEnquiryDashboardStats({ type, period: "monthly" });
    const values = Array.isArray(stats?.datasets?.[0]?.data) ? stats.datasets[0].data : [];
    return values.reduce((sum: number, value: number) => sum + Number(value || 0), 0);
  }

  // Total count for a single source using the table API (no auth for totalCount via stats)
  export async function getEnquiryCountBySource(source: string): Promise<number> {
    try {
      const result = await getEnquiryTableData({ limit: 1, page: 1, source });
      return result?.totalCount ?? 0;
    } catch {
      return 0;
    }
  }

  // Sum of current-week counts across multiple source types
  export async function getEnquiryWeeklyCount(sources: string[]): Promise<number> {
    const now = new Date();
    const day = now.getDay() || 7; // Mon=1 … Sun=7
    const monday = new Date(now);
    monday.setDate(now.getDate() - day + 1);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);

    const counts = await Promise.all(
      sources.map(type =>
        getEnquiryDashboardStats({ type, startDate: fmt(monday), endDate: fmt(sunday), period: 'custom' })
          .then(stats => {
            const data: number[] = Array.isArray(stats?.datasets?.[0]?.data) ? stats.datasets[0].data : [];
            return data.reduce((s, v) => s + Number(v || 0), 0);
          })
          .catch(() => 0)
      )
    );
    return counts.reduce((sum, c) => sum + c, 0);
  }

  // Sum of current-month counts across multiple source types
  export async function getEnquiryMonthlyCount(sources: string[]): Promise<number> {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
    const startDate = `${y}-${m}-01`;
    const endDate   = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;

    const counts = await Promise.all(
      sources.map(type =>
        getEnquiryDashboardStats({ type, startDate, endDate, period: 'custom' })
          .then(stats => {
            const data: number[] = Array.isArray(stats?.datasets?.[0]?.data) ? stats.datasets[0].data : [];
            return data.reduce((s, v) => s + Number(v || 0), 0);
          })
          .catch(() => 0)
      )
    );
    return counts.reduce((sum, c) => sum + c, 0);
  }


  export const deleteEnquiryAPI = async (id: string) => {
    // const token = localStorage.getItem("token"); // 🔹 Retrieve token


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
  
    const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+`api/enquiry/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete Enquiry");
    }
  
    return response.json();
  };


  
  

  export const getEnquiryById = async (id: string) => {
    // const token = localStorage.getItem("token"); // 🔹 Retrieve token


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
  
    const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+`api/enquiry/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // body: JSON.stringify({ id }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get Enquiry");
    }
  
    return response.json();
  };


  export const updateEnquiryAPI = async (id: any, enquiry: any) => {
    // const token = localStorage.getItem("token"); // 🔹 Retrieve token

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
  
    const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+`api/enquiry/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(enquiry),
    });
  
    if (!response.status) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add Enquiry");
    }
  
    return response.json();
  };
