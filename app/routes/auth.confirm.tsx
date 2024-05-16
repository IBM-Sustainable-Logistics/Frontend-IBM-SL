import { type LoaderFunctionArgs, redirect } from "@remix-run/deno";
import {
  createServerClient,
  parse,
  serialize,
} from "https://esm.sh/@supabase/ssr@0.1.0";
import { type EmailOtpType } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { load } from "https://deno.land/std@0.218.0/dotenv/mod.ts";
import { getSupabaseWithHeaders } from "../lib/supabase-server.ts";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  if (code) {
    const { headers, supabase } = getSupabaseWithHeaders({
      request,
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return redirect(next, { headers });
    }
  }

  return redirect("/login");
}
