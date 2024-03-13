import React from "react";

import Dashboard from "../components/dashboard.tsx";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";
import { getEstimates, getProjects } from "../lib/supabase-client.ts";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  const projects = await getProjects();



  return json({ success: true, projects }, { headers });
};

const ProjectsPage = () => {
  {
    /* here is how you get data from server  */
  }
  const { projects } = useLoaderData<typeof loader>();

  return (
    <div className="max-h-lvh">
      {/* here you can now pass the data to the component that uses it  */}
      <Dashboard Projects={projects} />
    </div>
  );
};

export default ProjectsPage;
