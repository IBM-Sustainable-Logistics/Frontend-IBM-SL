import React from "react";
import { useOutletContext } from "@remix-run/react";
import { SupabaseOutletContext } from "../lib/supabase.ts";
import Hero from "../components/hero.tsx";
import { Link } from "@remix-run/react";
import { Button } from "../components/ui/button.tsx";

const notfound = () => {
  const { supabase, domainUrl } = useOutletContext<SupabaseOutletContext>();

  return (
    <main
      className='flex flex-col justify-center items-center mb-16 mt-10 bg-background gap-16 
      md:mt-20
      md:gap-32'
    >
      <Hero
        jsx={(<>
          <h1 className='text-4xl lg:text-[3vw] leading-[3rem] font-bold min-[1800px]:leading-[4.25rem]'>
            Whoops, 404!
          </h1>
          <p className='text-2xl lg:text-[1.5vw] min-[1800px]:leading-[3.5rem]'>
            We could not find the page that you are looking for.
          </p>
        </>)}
      />
    </main>
  );
};

export default notfound;
