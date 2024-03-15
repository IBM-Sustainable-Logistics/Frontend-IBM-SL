import React, { useEffect, useState } from "react";

import Dashboard from "../components/dashboard.tsx";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";
import { getProjects } from "../lib/supabase-client.ts";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  const projects = await getProjects();

  if (!serverSession) {
    return redirect("/signin", { headers });
  }

  return json({ success: true, projects }, { headers });
};

const ProjectsPage = () => {
  const { projects } = useLoaderData<typeof loader>();

  return (
    <div className='max-h-lvh'>
      <Dashboard Projects={projects} />
    </div>
  );
};

export default ProjectsPage;
