import React from "react";
import { SignUpForm } from "../components/account/SignUpForm.tsx";
import { useOutletContext } from "@remix-run/react";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Database } from "../lib/utils/types.ts";
import { SupabaseOutletContext } from "../lib/supabase.ts";
import { LoaderFunctionArgs } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";
import { redirect } from "@remix-run/deno";
import { json } from "@remix-run/deno";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  if (serverSession) {
    return redirect("/projects", { headers });
  }

  return json({ success: true }, { headers });
};

const SignUp = () => {
  const { supabase, domainUrl } = useOutletContext<SupabaseOutletContext>();

  return (
    <div className=" min-h-screen flex items-center justify-center">
      <SignUpForm supabase={supabase} />
    </div>
  );
};

export default SignUp;
