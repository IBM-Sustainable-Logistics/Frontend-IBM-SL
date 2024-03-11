import React from "react";

import Dashboard from "../components/dashboard.tsx";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/utils/supabase-server.ts";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  if (serverSession) {
    return redirect("/signup", { headers });
  }

  return json({ success: true }, { headers });
};

const ProjectsPage = () => {
  return (
    <div className="max-h-lvh">
      <Dashboard />
    </div>
  );
};

export default ProjectsPage;
