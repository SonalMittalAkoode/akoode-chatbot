// api/serviceByCity.ts

type SBCCityFilter = {
  limit: number;
  page: number;
  q?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "";
const withTrailingSlash = (value: string) => (value && !value.endsWith("/") ? `${value}/` : value);
const AI_SUGGESTION_CITY_URL =
  process.env.NEXT_PUBLIC_LOCAL_AI_SUGGESTION_TEST === "true"
    ? "/api/local-ai-suggestions/service-by-city"
    : `${withTrailingSlash(BASE_URL)}api/ai-suggestions/service-by-city`;

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

export const generateSBCCitySeoSuggestionsAPI = async (payload: Record<string, any>): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(AI_SUGGESTION_CITY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to generate city SEO suggestions");
  }
  return response.json();
};

export const generateSBCCitySeoFieldSuggestionAPI = async (payload: Record<string, any>): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${AI_SUGGESTION_CITY_URL}/field`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to regenerate city field");
  }
  return response.json();
};

export const addServiceByCityAPI = async (formData: FormData): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/service-by-city`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add Service By City");
  }
  return response.json();
};

export async function getSBCCityTableData(
  filter: SBCCityFilter
): Promise<{ items: any[]; totalCount: number }> {
  try {
    const searchQ = filter.q ? `&q=${encodeURIComponent(filter.q)}` : "";
    const response = await fetch(
      `${BASE_URL}api/service-by-city?limit=${filter.limit}&page=${filter.page}${searchQ}`
    );
    if (!response.ok) throw new Error("Failed to fetch service-by-city entries");
    return (await response.json()) as { items: any[]; totalCount: number };
  } catch (error) {
    console.error("Error fetching SBC City:", error);
    return { items: [], totalCount: 0 };
  }
}

export const deleteSBCCityAPI = async (id: string): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/service-by-city/${id}`, {
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

export const getSBCCityById = async (id: string): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/service-by-city/${id}`, {
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

export async function getSBCCityBySlug(
  slug: string,
  market?: string,
  city?: string,
  previewToken?: string
): Promise<any> {
  const base = process.env.NEXT_PUBLIC_FRONTEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "";
  if (!base || !slug) return null;
  const params = new URLSearchParams();
  if (market) params.set("market", market);
  if (city) params.set("city", city);
  if (previewToken) params.set("preview", previewToken);
  const qs = params.toString() ? `?${params.toString()}` : "";
  const url = `${base}api/service-by-city/slug/${slug}${qs}`;
  try {
    const res = await fetch(url,
      previewToken
        ? { cache: "no-store" }
        : { next: { revalidate: 3600, tags: [`sbc-city-${market || "default"}-${city || "default"}-${slug}`] } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export const updateSBCCityAPI = async (id: string, formData: FormData): Promise<any> => {
  const token = getAuthToken();
  const response = await fetch(`${BASE_URL}api/service-by-city/${id}`, {
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

export async function getPublicSBCCityList(): Promise<any> {
  const base = process.env.NEXT_PUBLIC_FRONTEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "";
  const url = `${base}api/service-by-city/list?limit=200`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("[getPublicSBCCityList] fetch error:", err);
    return null;
  }
}
