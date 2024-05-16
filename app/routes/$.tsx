import React from "react";
import { useOutletContext } from "@remix-run/react";
import { SupabaseOutletContext } from "../lib/supabase.ts";
import Hero from "../components/hero.tsx";
import { Link } from "@remix-run/react";
import { Button } from "../components/ui/button.tsx";
import truck from "../assets/dump-truck.gif";
import { AspectRatio } from "../components/ui/aspect-ratio.tsx";

const notfound = () => {
  const { supabase, domainUrl } = useOutletContext<SupabaseOutletContext>();

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-6 px-4 md:px-6">
      <a href="https://ayran-ibm-sl.deno.dev/">
        <img
          alt="404 Illustration"
          className="max-w-[300px] sm:max-w-[400px]"
          height={400}
          src={truck}
          style={{
            aspectRatio: "400/400",
            objectFit: "cover",
          }}
          width={400}
        />
      </a>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Oops! Page not found.
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-[500px]">
          The page you are looking for doesn't exist or has been moved. Let's
          get you back on track.
        </p>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          to="/"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default notfound;
