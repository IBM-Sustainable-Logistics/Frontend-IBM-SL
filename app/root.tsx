import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/deno";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import * as React from "https://esm.sh/react@18.2.0";
import NavBar from "./components/navbar.tsx";
import stylesheet from "./styles/global.css";
import Footer from "./components/footer.tsx";
import { createBrowserClient } from "https://esm.sh/@supabase/ssr@0.1.0";
import { useState } from "https://esm.sh/react@18.2.0";
import { load } from "https://deno.land/std@0.218.0/dotenv/mod.ts";
import { Database } from "./lib/utils/types.ts";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];
const env = await load();

export default function App() {
  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <NavBar />
      <body>
        <Outlet context={{ supabase }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
      <Footer />
    </html>
  );
}
