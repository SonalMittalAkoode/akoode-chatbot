import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const redirectTo = searchParams.get("redirect") || "/";
  const edit = searchParams.get("edit") || "";

  if (!secret || secret !== process.env.NEXT_PUBLIC_PREVIEW_SECRET) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  (await draftMode()).enable();

  const target = edit
    ? `${redirectTo}?edit=${encodeURIComponent(edit)}`
    : redirectTo;
  redirect(target);
}
