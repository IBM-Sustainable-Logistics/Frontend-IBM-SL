import React from "react";
import { useOutletContext } from "@remix-run/react";
import { SupabaseOutletContext } from "../lib/supabase.ts";
import Hero from "../components/hero.tsx";
import { Link } from "@remix-run/react";
import { Button } from "../components/ui/button.tsx";
import truck from "../assets/dump-truck.gif";

const notfound = () => {
  const { supabase, domainUrl } = useOutletContext<SupabaseOutletContext>();

  return (
    <main
      className='flex flex-col justify-center items-center mb-16 mt-10 bg-background gap-16 
      md:mt-20
      md:gap-32'
    >
      
          <h1 className='text-4xl lg:text-[3vw] leading-[3rem] font-bold min-[1800px]:leading-[4.25rem]'>
            Whoops, 404!
          </h1>
          <img
            src={truck}
            alt='Page not found'
            className='w-full'/>

    </main>
  );
};

export default notfound;
