import * as React from "react";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/deno";
import { createServerClient, parse, serialize } from 'https://esm.sh/@supabase/ssr@0.1.0'
import { load } from "https://deno.land/std@0.218.0/dotenv/mod.ts";

import Hero from "../components/hero.tsx";

export const meta: MetaFunction = () => {
  return [
    { title: "IBM SL" },
    { name: "description", content: "Welcome to SL" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookies = parse(request.headers.get('Cookie') ?? '')
  const headers = new Headers()

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

  return new Response('...', {
    headers,
  })
}

export default function Index() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-6 bg-background font-mono">
      <Hero /> {/* Use the Hero component */}
    </div>
  );
}
