// api/caseStudyLatest.ts

type CSLFilter = {
  limit: number;
  page: number;
  q?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "";
const withTrailingSlash = (value: string) => (value && !value.endsWith("/") ? `${value}/` : value);

const resolveFrontendApiBase = () => {
  const base = process.env.NEXT_PUBLIC_FRONTEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "";
  if (typeof window === "undefined" && base.startsWith("/")) {
    const backendBase = process.env.LOCAL_BACKEND_URL || "http://localhost:5005";
    if (base.startsWith("/local-frontend-api")) return `${backendBase}/frontend/`;
    if (base.startsWith("/local-admin-api")) return `${backendBase}/admin/`;
    if (base.startsWith("/local-api")) return `${backendBase}/`;
  }
  return withTrailingSlash(base);
};

const getAuthToken = (): string => {
  if (typeof window === "undefined") {
    throw new Error("LocalStorage is not available on the server.");
  }
  const storedUser = sessionStorage.getItem("user");
  if (!storedUser) throw new Error("User not authenticated!");
  let userData: any;
  try {
    userData = JSON.parse(storedUser);
  } catch {
    throw new Error("Invalid user data in storage!");
  }
  const token = userData?.token as string | undefined;
  if (!token) throw new Error("User not authenticated!");
  return token;
};

export const addCaseStudyLatestAPI = async (formData: FormData): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/case-study-latest`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add case study");
  }
  return response.json();
};

export const updateCaseStudyLatestAPI = async (
  id: string,
  formData: FormData
): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/case-study-latest/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update entry");
  }
  return response.json();
};

export async function getCSLTableData(
  filter: CSLFilter
): Promise<{ items: any[]; totalCount: number }> {
  try {
    const searchQ = filter.q ? `&q=${encodeURIComponent(filter.q)}` : "";
    const response = await fetch(
      `${BASE_URL}api/case-study-latest?limit=${filter.limit}&page=${filter.page}${searchQ}`
    );
    if (!response.ok) throw new Error("Failed to fetch case studies");
    return (await response.json()) as { items: any[]; totalCount: number };
  } catch (error) {
    console.error("Error fetching case-study-latest:", error);
    return { items: [], totalCount: 0 };
  }
}

export const getCSLById = async (id: string): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/case-study-latest/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to get entry");
  }
  return response.json();
};

// Public fetch (no auth) — used by the frontend dynamic page.
export async function getCaseStudyLatestBySlug(
  slug: string,
  previewToken?: string
): Promise<any> {
  const base = resolveFrontendApiBase();
  if (!base || !slug) return null;
  const qs = previewToken ? `?preview=${encodeURIComponent(previewToken)}` : "";
  const url = `${base}api/case-study-latest/slug/${slug}${qs}`;
  try {
    const res = await fetch(
      url,
      previewToken
        ? { cache: "no-store" }
        : { next: { revalidate: 3600, tags: [`case-study-latest-${slug}`] } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function getCaseStudyLatestList(limit: number = 200): Promise<any[]> {
  const base = resolveFrontendApiBase();
  const url = `${base}api/case-study-latest/list?limit=${limit}`;
  try {
    // ISR: backend paginates via skip/limit; 5-min cache — busted instantly by
    // /api/revalidate (revalidatePath) when a case study is edited in admin.
    const res = await fetch(url, {
      next: { revalidate: 300, tags: ["case-study-latest-list"] },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.items) ? json.items : [];
  } catch {
    return [];
  }
}

export const deleteCSLAPI = async (id: string): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/case-study-latest/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete entry");
  }
  return response.json();
};
