const getFrontendApiBase = () =>
  process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

export async function getServiceFeatureData() {
  try {
    const baseUrl = getFrontendApiBase();
    if (!baseUrl) return [];
    const response = await fetch(baseUrl + "api/service/list?featured=yes&limit=9",
      {
        next: { revalidate: 60 }
      }); // Replace with actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array in case of an error
  }
}
export async function getServiceHotData() {
  try {
    const baseUrl = getFrontendApiBase();
    if (!baseUrl) return [];
    const response = await fetch(baseUrl + "api/service/list?hot=yes&limit=6",
      {
        next: { revalidate: 60 }
      }); // Replace with actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array in case of an error
  }
}

export const getServiceById = async (id: string) => {
  // const token = localStorage.getItem("token"); // 🔹 Retrieve token

  const baseUrl = getFrontendApiBase();
  const response = await fetch(baseUrl + `api/service/detail/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 60 }
    // body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get Service");
  }

  return response.json();
};

export async function getServiceFilterData(filter: any) {
  let querystring = ""
  if (filter.category) {
    querystring += "&category=" + filter.category
  }
  if (filter.keyword) {
    querystring += "&keyword=" + filter.keyword
  }
  if (filter.city) {
    querystring += "&city=" + filter.city
  }

  if (filter.servicetype) {
    querystring += "&Servicetype=" + filter.servicetype
  }
  if (filter.location) {
    querystring += "&location=" + filter.location
  }

  try {
    const baseUrl = getFrontendApiBase();
    if (!baseUrl) return [];
    const response = await fetch(baseUrl + "api/service/list?limit=" + filter.limit + "&skip=" + filter.page + querystring,
      {
        next: { revalidate: 60 }
      }); // Replace with actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array in case of an error
  }
}

export async function getServiceCompareData(servicecomparelist: string) {
  try {
    const baseUrl = getFrontendApiBase();
    if (!baseUrl) return [];
    const response = await fetch(baseUrl + "api/service/Serviceidlist?prolist=" + servicecomparelist,
      {
        next: { revalidate: 60 }
      }); // Replace with actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array in case of an error
  }
}

export const getServiceBySlug = async (slug: string) => {
  // if (!slug) {
  //   return null;
  // }

  // const apiUrl = getFrontendApiBase();
  // // Add timestamp to prevent browser caching on client-side navigation
  // const timestamp = Date.now();
  // const url = `${apiUrl}api/service/slug/${slug}?t=${timestamp}`;

  // const response = await fetch(url, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Cache-Control": "no-cache, no-store, must-revalidate",
  //     "Pragma": "no-cache",
  //     "Expires": "0",
  //     // Authorization: `Bearer ${token}`,
  //   },
  //   cache: 'no-store', // Always fetch fresh data to prevent stale content on navigation
  //   next: { revalidate: 0 } // Ensure no revalidation caching
  //   // body: JSON.stringify({ id }),
  // });

  // let responseBody: any = null;
  // try {
  //   responseBody = await response.json();
  // } catch (err) {
  //   responseBody = null;
  // }

  // if (!response.ok) {
  //   if (response.status === 404 || responseBody?.status === "fail") {
  //     return null;
  //   }
  //   const message = responseBody?.message || `Failed to get Service (status ${response.status})`;
  //   throw new Error(message);
  // }

  // return responseBody;
  const response = await fetch(process.env.NEXT_PUBLIC_FRONTEND_API_URL + `api/service/slug/${slug}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 3600, tags: [`service-${slug}`] },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get blog");
  }

  return response.json();
};

export const addServiceAPI = async (title: FormData) => {
  if (typeof window === "undefined") {
    throw new Error("LocalStorage is not available on the server side");
  }

  const storedUser = sessionStorage.getItem("user");
  if (!storedUser) {
    throw new Error("User not authenticated!");
  }

  const userData = JSON.parse(storedUser) as { token?: string };
  const token = userData?.token;

  if (!token) {
    throw new Error("User not authenticated!");
  }

  const baseUrl = getFrontendApiBase();
  const response = await fetch(baseUrl + "api/service/sell", {
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
    body: title,
  });

  if (!response.status) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add Service");
  }

  return response.json();
};


export async function getServiceListbyServicepage(servicepage: string) {
  try {
    const baseUrl = getFrontendApiBase();
    if (!baseUrl) return [];
    const response = await fetch(baseUrl + "api/service/Servicelistpage/" + servicepage,
      {
        next: { revalidate: 60 }
      }); // Replace with actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array in case of an error
  }
};

export async function getServiceListTrends(servicetypeid: string, categoriesid: string) {
  try {
    const baseUrl = getFrontendApiBase();
    if (!baseUrl) return [];
    const response = await fetch(baseUrl + "api/service/Servicelisttrends?servicetypeid=" + servicetypeid + "&categoriesid=" + categoriesid,
      {
        next: { revalidate: 60 }
      }); // Replace with actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array in case of an error
  }
};

export async function getServiceListbyBuilder(builderid: string) {
  try {
    const baseUrl = getFrontendApiBase();
    if (!baseUrl) return [];
    const response = await fetch(baseUrl + "api/service/Servicelistbuilder/" + builderid,
      {
        next: { revalidate: 60 }
      }); // Replace with actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array in case of an error
  }
};