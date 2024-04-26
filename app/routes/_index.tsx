import React, { useState } from "https://esm.sh/react@18.2.0";
import {
  type MetaFunction,
  type LoaderFunctionArgs,
  redirect,
  json,
} from "@remix-run/deno";
import Hero from "../components/hero.tsx";
import Section from "../components/section.tsx";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";

export const meta: MetaFunction = () => {
  return [
    { title: "IBM SL" },
    { name: "description", content: "Welcome to SL" },
  ];
};

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  return json({ success: true }, { headers });
};

export default function Index() {
  return (
    <main className='flex flex-col justify-center items-center mt-20 bg-background'>
      <Hero />
      <Section backgroundColor='#d6d6d6' textColor='black' />
    </main>
  );
}
