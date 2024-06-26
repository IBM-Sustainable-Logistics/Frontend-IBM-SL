import React from "react";
import { useOutletContext } from "@remix-run/react";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Database } from "../lib/utils/types.ts";
import { SiginOutletContext, SupabaseOutletContext } from "../lib/supabase.ts";
import { LoaderFunctionArgs } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";
import { redirect } from "@remix-run/deno";
import { json } from "@remix-run/deno";
import { SignInForm } from "../components/account/SignInForm.tsx";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  if (serverSession) {
    return redirect("/projects", { headers });
  }

  return json({ success: true }, { headers });
};

const SignIn = () => {
  const { supabase, domainUrl } = useOutletContext<SupabaseOutletContext>();
  const { setOpenSign, setMessage } = useOutletContext<SiginOutletContext>();
  return (
    <div className=" min-h-screen flex items-center justify-center">
      <SignInForm
        supabase={supabase}
        setSignIn={setOpenSign}
        setMessagesign={setMessage}
      />
    </div>
  );
};

export default SignIn;
