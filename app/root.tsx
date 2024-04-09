import { cssBundleHref } from "@remix-run/css-bundle";
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/deno";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import React from "react";
import { NavBar } from "./components/navbar.tsx";
import stylesheet from "./styles/global.css";
import Footer from "./components/footer.tsx";

import {
  getDomainEnv,
  getSupabaseEnv,
  getSupabaseWithSessionAndHeaders,
} from "./lib/supabase-server.ts";
import { useSupabase } from "./lib/supabase.ts";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { serverSession, headers } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  const domainUrl = await getDomainEnv();

  const env = getSupabaseEnv();

  return json({ serverSession, env, domainUrl }, { headers });
};

export default function App() {
  const { env, serverSession, domainUrl } = useLoaderData<typeof loader>();

  const { supabase } = useSupabase({ env, serverSession });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <NavBar serverSession={serverSession} supabase={supabase} />
      <body>
        <Outlet context={{ supabase, domainUrl }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload port={8002} />
      </body>
    </html>
  );
}
