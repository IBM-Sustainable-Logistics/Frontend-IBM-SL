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
    <main
      className='flex flex-col justify-center items-center mb-16 mt-10 bg-background gap-16 
    md:mt-20
    md:gap-32'
    >
      <Hero />
      <Section backgroundColor='#d6d6d6' textColor='black'>
        <div className='text-center mx-[2rem] lg:mx-[12rem] my-[2.5rem] flex flex-col gap-2'>
          <h1 className='text-4xl lg:text-[2.5rem] leading-10 font-bold'>
            Our vision
          </h1>
          <p className='text-[1.1rem] md:px-[5rem] lg:px-[2rem] text-left lg:text-[1.2rem]'>
            Our goal is to make it easy and quick for companies and other groups
            to measure their CO2 emissions. This will help companies report
            their environmental impact more accurately, and together we can work
            towards a more sustainable future.
          </p>
        </div>
      </Section>
    </main>
  );
}
