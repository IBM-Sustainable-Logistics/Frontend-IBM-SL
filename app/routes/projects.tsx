import React, { useEffect, useState } from "react";

import Dashboard from "../components/dashboard/dashboard.tsx";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";
import { getProjects, insertProject } from "../lib/supabase-client.ts";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  const projects = await getProjects();

  if (!serverSession) {
    return redirect("/signin", { headers });
  }

  const userId = serverSession.user.id;

  console.log(projects);

  return json({ success: true, projects, userId }, { headers });
};

const ProjectsPage = () => {
  const { projects, userId } = useLoaderData<typeof loader>();

  return (
    <div className="max-h-lvh">
      <Dashboard Projects={projects} UserId={userId} />
    </div>
  );
};

export default ProjectsPage;
