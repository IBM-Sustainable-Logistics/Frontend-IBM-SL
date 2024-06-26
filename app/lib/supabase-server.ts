import {
  createServerClient,
  parse,
  serialize,
} from "https://esm.sh/@supabase/ssr@0.1.0";
import { load } from "https://deno.land/std@0.218.0/dotenv/mod.ts";

const env = await load();

export const getDomainEnv = () => (
  {
    DOMAIN_URL: Deno.env.get("DOMAIN_URL") || env["DOMAIN_URL"],
  }
);

export const getSupabaseEnv = () => (
  {
    SUPABASE_URL: Deno.env.get("SUPABASE_URL") || env["SUPABASE_URL"],
    SUPABASE_ANON_KEY: Deno.env.get("SUPABASE_ANON_KEY") ||
      env["SUPABASE_ANON_KEY"],
  }
);

export const getLoginForTestingEnv = () => (
  {
    EMAIL_TEST: Deno.env.get("EMAIL") || env["EMAIL"],
    PASSWORD_TEST: Deno.env.get("PASSWORD") || env["PASSWORD"],
  }
);

export function getSupabaseWithHeaders({ request }: { request: Request }) {
  const cookies = parse(request.headers.get("Cookie") ?? "");
  const headers = new Headers();

  const supabase = createServerClient(
    Deno.env.get("SUPABASE_URL") || env["SUPABASE_URL"],
    Deno.env.get("SUPABASE_ANON_KEY") || env["SUPABASE_ANON_KEY"],
    {
      cookies: {
        get(key) {
          return cookies[key];
        },
        set(key, value, options) {
          headers.append("Set-Cookie", serialize(key, value, options));
        },
        remove(key, options) {
          headers.append("Set-Cookie", serialize(key, "", options));
        },
      },
    },
  );

  return { supabase, headers };
}

export async function getSupabaseWithSessionAndHeaders({
  request,
}: {
  request: Request;
}) {
  const { supabase, headers } = getSupabaseWithHeaders({
    request,
  });
  const {
    data: { session: serverSession },
  } = await supabase.auth.getSession();

  return { serverSession, headers, supabase };
}
