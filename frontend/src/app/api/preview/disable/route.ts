import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const back = searchParams.get("back") || "/";
  (await draftMode()).disable();
  redirect(back);
}
