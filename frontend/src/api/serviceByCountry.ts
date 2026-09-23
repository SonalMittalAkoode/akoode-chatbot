// api/serviceByCountry.ts

type SBCFilter = {
  limit: number;
  page: number;
  q?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "";
const withTrailingSlash = (value: string) => (value && !value.endsWith("/") ? `${value}/` : value);
const AI_SUGGESTION_URL =
  process.env.NEXT_PUBLIC_LOCAL_AI_SUGGESTION_TEST === "true"
    ? "/api/local-ai-suggestions/service-by-country"
    : `${withTrailingSlash(BASE_URL)}api/ai-suggestions/service-by-country`;

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
  if (process.env.NEXT_PUBLIC_LOCAL_AI_SUGGESTION_TEST === "true") return "local-test-token";
  const storedUser = sessionStorage.getItem("user");
  if (!storedUser) {
    if (process.env.NEXT_PUBLIC_LOCAL_AI_SUGGESTION_TEST === "true") return "local-test-token";
    throw new Error("User not authenticated!");
  }
  let userData: any;
  try {
    userData = JSON.parse(storedUser);
  } catch {
    if (process.env.NEXT_PUBLIC_LOCAL_AI_SUGGESTION_TEST === "true") return "local-test-token";
    throw new Error("Invalid user data in storage!");
  }
  const token = userData?.token as string | undefined;
  if (!token) {
    if (process.env.NEXT_PUBLIC_LOCAL_AI_SUGGESTION_TEST === "true") return "local-test-token";
    throw new Error("User not authenticated!");
  }
  return token;
};

export const addServiceByCountryAPI = async (formData: FormData): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/service-by-country`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add Service By Country");
  }
  return response.json();
};

export async function getSBCTableData(
  filter: SBCFilter
): Promise<{ items: any[]; totalCount: number }> {
  try {
    const searchQ = filter.q ? `&q=${encodeURIComponent(filter.q)}` : "";
    const response = await fetch(
      `${BASE_URL}api/service-by-country?limit=${filter.limit}&page=${filter.page}${searchQ}`
    );
    if (!response.ok) throw new Error("Failed to fetch service-by-country entries");
    return (await response.json()) as { items: any[]; totalCount: number };
  } catch (error) {
    console.error("Error fetching SBC:", error);
    return { items: [], totalCount: 0 };
  }
}

export const deleteSBCAPI = async (id: string): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/service-by-country/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete entry");
  }
  return response.json();
};

export const getSBCById = async (id: string): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/service-by-country/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to get entry");
  }
  return response.json();
};

export async function getSBCBySlug(slug: string, market?: string, previewToken?: string): Promise<any> {
  const base = resolveFrontendApiBase();
  if (!base || !slug) return null;
  const params = new URLSearchParams();
  if (market) params.set("market", market);
  if (previewToken) params.set("preview", previewToken);
  const qs = params.toString() ? `?${params.toString()}` : "";
  const url = `${base}api/service-by-country/slug/${slug}${qs}`;
  try {
    const res = await fetch(url,
      previewToken
        ? { cache: "no-store" }
        : { next: { revalidate: 3600, tags: [`sbc-${market || "default"}-${slug}`] } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export const updateSBCAPI = async (id: string, formData: FormData): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/service-by-country/${id}`, {
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

export const generateSBCSeoSuggestionsAPI = async (payload: Record<string, any>): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(AI_SUGGESTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to generate SEO suggestions");
  }
  return response.json();
};

export const generateSBCSeoFieldSuggestionAPI = async (payload: Record<string, any>): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${AI_SUGGESTION_URL}/field`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to regenerate field");
  }
  return response.json();
};

export async function getPublicSBCList(): Promise<any> {
  const base = resolveFrontendApiBase();
  const url = `${base}api/service-by-country/list?limit=200`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("[getPublicSBCList] fetch error:", err);
    return null;
  }
}
