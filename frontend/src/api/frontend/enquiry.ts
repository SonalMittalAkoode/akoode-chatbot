const FRONTEND_API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_FRONTEND_API_URL ||
  "http://localhost:5000";

const buildFrontendUrl = (slug: string) => {
  const cleanedSlug = slug.replace(/^\/+|\/+$/g, "");
  return `${FRONTEND_API_BASE.replace(/\/$/, "")}/frontend/api/${cleanedSlug}`;
};

type EnquiryPayload = Record<string, unknown> | FormData;

const postFrontendEnquiry = async (slug: string, payload: EnquiryPayload) => {
  const url = buildFrontendUrl(slug);
  const isFormData = payload instanceof FormData;
  const response = await fetch(url, {
    method: "POST",
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body: isFormData ? payload : JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to submit enquiry");
  }

  return response.json();
};

export const addEnquiryAPI = async (payload: Record<string, unknown>) =>
  postFrontendEnquiry("enquiry", payload);

export const sendJobEnquiry = async (payload: FormData) =>
  postFrontendEnquiry("jobenquiry/enquiry", payload);

