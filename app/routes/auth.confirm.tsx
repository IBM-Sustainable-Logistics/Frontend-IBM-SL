import { redirect, type LoaderFunctionArgs } from '@remix-run/deno'
import { createServerClient, parse, serialize } from 'https://esm.sh/@supabase/ssr@0.1.0'
import { type EmailOtpType } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import { load } from "https://deno.land/std@0.218.0/dotenv/mod.ts";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  const next = requestUrl.searchParams.get('next') || '/'
  const headers = new Headers()

  if (token_hash && type) {
    const cookies = parse(request.headers.get('Cookie') ?? '')

    const env = await load();


    const supabase = createServerClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!, {
      cookies: {
        get(key) {
          return cookies[key]
        },
        set(key, value, options) {
          headers.append('Set-Cookie', serialize(key, value, options))
        },
        remove(key, options) {
          headers.append('Set-Cookie', serialize(key, '', options))
        },
      },
    })

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      return redirect(next, { headers })
    }
  }

  // return the user to an error page with instructions
  return redirect('/auth/auth-code-error', { headers })
}