import { getRequestNonce } from "@/lib/csp-server";

export default async function JsonLdScript({ id, data }) {
  const nonce = await getRequestNonce();

  return (
    <script
      id={id}
      suppressHydrationWarning
      nonce={nonce}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
