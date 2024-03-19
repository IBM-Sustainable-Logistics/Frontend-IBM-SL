import React from "react";
import { useOutletContext } from "@remix-run/react";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Database } from "../lib/utils/types.ts";
import { SupabaseOutletContext } from "../lib/supabase.ts";
import { LoaderFunctionArgs } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";
import { redirect } from "@remix-run/deno";
import { json } from "@remix-run/deno";
import { UpdateForm } from "../components/account/UpdateForm.tsx";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  return json({ success: true }, { headers });
};

const Forgot = () => {
  const { supabase } = useOutletContext<SupabaseOutletContext>();

  return (
    <div className=" min-h-screen flex items-center justify-center">
      <UpdateForm supabase={supabase} />
    </div>
  );
};

export default Forgot;
