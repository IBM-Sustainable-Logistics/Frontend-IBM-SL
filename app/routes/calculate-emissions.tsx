import React from "react";

import Calculator from "../components/calculator.tsx";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  if (serverSession) {
    console.log(serverSession, { headers });
  }

  return json({ success: true }, { headers });
};

const CalculateEmissionsPage = () => {
  return (
    <div className=" min-h-screen flex items-center justify-center">
      <Calculator />
    </div>
  );
};

export default CalculateEmissionsPage;
