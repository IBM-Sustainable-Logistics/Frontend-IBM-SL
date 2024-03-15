import React from "react";

import DataVisualization from "../components/DataVisualization.tsx";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";
import { LoaderFunctionArgs, json } from "@remix-run/deno";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  return json({ success: true }, { headers });
};

const DVPage = () => {
  return (
    <div className="max-h-lvh min-h-screen ">
      <DataVisualization />
    </div>
  );
};

export default DVPage;
