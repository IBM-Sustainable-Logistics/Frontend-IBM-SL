import type { ActionFunctionArgs } from "@remix-run/deno";
import { redirect, json } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";
import { insertProject } from "../lib/supabase-client.ts";

export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers, serverSession } =
    await getSupabaseWithSessionAndHeaders({
      request,
    });

  if (!serverSession) {
    return redirect("/login", { headers });
  }

  const formData = await request.formData();
  const title = formData.get("title")?.toString();
  const description = formData.get("descriptionProject")?.toString();
  const userId = formData.get("userId")?.toString();

  const skipRevalidation = ["gitposts", "profile.$username"];

  // Check if userId and tweetId are present
if (!userId || !title || !description) {
    return json(
        { error: "Post/user information missing" },
        { status: 400, headers }
    );
}

const { error } = await insertProject(
    title,
    description,
    userId
);

if (error) {
    return json(
        { error: "Failed create new project", skipRevalidation },
        { status: 500, headers }
    );
}

  return json({ ok: true, error: null, skipRevalidation }, { headers });
}