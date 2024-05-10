import React, { useState } from "https://esm.sh/react@18.2.0";
import {
  type MetaFunction,
  type LoaderFunctionArgs,
  redirect,
  json,
} from "@remix-run/deno";
import Hero from "../components/hero.tsx";
import { Link } from "@remix-run/react";
import { Button } from "../components/ui/button.tsx";
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
      <Hero
        jsx={(<>
          <h1 className='text-4xl lg:text-[3vw] leading-[3rem] font-bold min-[1800px]:leading-[4.25rem]'>
            Calculate your footprint emissions for
            <span style={{color: "#3d815c"}}> FREE</span>
          </h1>
          <p className='text-2xl lg:text-[1.5vw] min-[1800px]:leading-[3.5rem]'>
            Use our web service to calculate your carbon footprint from the
            transportation of your truck and e-truck.
          </p>
          <Link to='/calculate-emissions'>
            <Button className='bg-black text-white w-fit	md:w-88 text-2xl py-7 px-10'>
              Try it out
            </Button>
          </Link>
        </>)}
      />
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
