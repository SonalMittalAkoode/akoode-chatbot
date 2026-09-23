import { headers } from "next/headers";
import { CSP_NONCE_HEADER } from "@/lib/csp";

export async function getRequestNonce() {
  const headerStore = await headers();
  return headerStore.get(CSP_NONCE_HEADER) || undefined;
}
