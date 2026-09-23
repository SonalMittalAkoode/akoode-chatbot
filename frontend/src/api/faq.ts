export const addFaqAPI = async (faqData: any) => {
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

  const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+"api/faq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify( faqData ),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add Faq");
  }

  return response.json();
};


export async function getFaqTableData(filter: {
  limit: number;
  page: number;
  q?: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 10));

  try {
    const searchQ = filter.q ? `&q=${encodeURIComponent(filter.q)}` : "";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ADMIN_API_URL}api/faq?limit=${filter.limit}&skip=${filter.page}${searchQ}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch FAQs");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return { items: [], totalCount: 0 };
  }
}


export const deleteFaqAPI = async (id: string) => {
  const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
const token =userData.token
  if (!token) {
    throw new Error("User not authenticated!");
  }

  const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+`api/faq/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete Faq");
  }

  return response.json();
};





export const getFaqById = async (id: string) => {
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

  const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+`api/faq/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get Faq");
  }

  return response.json();
};

export const getFaqByServiceIdAdmin = async (serviceId: string) => {
  const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const token = userData.token;
  if (!token) {
    throw new Error("User not authenticated!");
  }

  const response = await fetch(
    process.env.NEXT_PUBLIC_ADMIN_API_URL + `api/faq?serviceid=${serviceId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get service FAQs");
  }

  return response.json();
};


export const updateFaqAPI = async (id: any, faq: any) => {
  const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
const token =userData.token


  if (!token) {
    throw new Error("User not authenticated!");
  }

  const response = await fetch(process.env.NEXT_PUBLIC_ADMIN_API_URL+`api/faq/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(faq),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update faq");
  }

  return response.json();
};
