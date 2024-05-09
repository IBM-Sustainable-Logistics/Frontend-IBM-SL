import React from "react";
import { useOutletContext } from "@remix-run/react";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Database } from "../lib/utils/types.ts";
import { SupabaseOutletContext } from "../lib/supabase.ts";
import { LoaderFunctionArgs } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";
import { redirect } from "@remix-run/deno";
import { json } from "@remix-run/deno";
import { ForgotForm } from "../components/account/ForgotForm.tsx";

const notfound = () => {
  const { supabase, domainUrl } = useOutletContext<SupabaseOutletContext>();

  return <div>404</div>;
};

export default notfound;
