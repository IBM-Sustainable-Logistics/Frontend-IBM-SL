import React from "react";

import { SignUpForm } from "../components/SignUpForm.tsx";
import { LoaderFunction, LoaderFunctionArgs, json } from "@remix-run/deno";
import { useLoaderData } from "@remix-run/react";
import { useOutletContext } from "@remix-run/react";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Database } from "../lib/utils/types.ts";

const SignUp = () => {
  const { supabase } = useOutletContext<{
    supabase: SupabaseClient<Database>;
  }>();

  console.log(supabase);

  return (
    <div className=" min-h-screen flex items-center justify-center">
      <SignUpForm supabase={supabase} />
    </div>
  );
};

export default SignUp;
