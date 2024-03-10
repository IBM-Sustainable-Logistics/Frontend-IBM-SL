import { createServerClient, parse, serialize } from "https://esm.sh/@supabase/ssr@0.1.0";
import { load } from "https://deno.land/std@0.218.0/dotenv/mod.ts";

const env = await load();

export const getDomainEnv = () => (
    {
        DOMAIN_URL: env.DOMAIN_URL!,
    }
);


export const getSupabaseEnv =  () => (
    {
        SUPABASE_URL: env.SUPABASE_URL!,
        SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY!,
      }
  );

export function getSupabaseWithHeaders({ request }: { request: Request }) {
  const cookies = parse(request.headers.get("Cookie") ?? "");
  const headers = new Headers();

  const supabase = createServerClient(
    env.SUPABASE_URL!,
    env.SUPABASE_ANON_KEY!,
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
    }
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