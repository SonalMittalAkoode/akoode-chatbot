const BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL ?? "";

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

export type DocxImportResult = {
  status: "success" | "needs-review" | "fail";
  fileName?: string;
  data?: Record<string, any>;
  errors: string[];
  warnings: string[];
  sectionsFound: string[];
  sectionsMissing: string[];
  message?: string;
};

async function postDocx(url: string, file: File): Promise<DocxImportResult> {
  const token = getAuthToken();
  const fd = new FormData();
  fd.append("docx", file);
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok && response.status !== 422) {
    throw new Error(json.message || "Failed to import DOCX file");
  }
  return json as DocxImportResult;
}

export const importServiceByCityDocxAPI = (file: File): Promise<DocxImportResult> =>
  postDocx(`${BASE_URL}api/docx-import/service-by-city`, file);

export const importServiceByCountryDocxAPI = (file: File): Promise<DocxImportResult> =>
  postDocx(`${BASE_URL}api/docx-import/service-by-country`, file);

export const importCaseStudyLatestDocxAPI = (file: File): Promise<DocxImportResult> =>
  postDocx(`${BASE_URL}api/docx-import/case-study-latest`, file);
