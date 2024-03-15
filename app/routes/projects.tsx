import React, { useEffect, useState } from "react";

import Dashboard from "../components/dashboard.tsx";
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

  return json({ success: true, projects }, { headers });
};

const ProjectsPage = () => {
  const { projects, serverSession } = useLoaderData<typeof loader>();

  const addProject =  (projectDetails) => {
    // try {
    //    insertProject(projectDetails);
    // } catch (error) {
    //   console.error("Failed to add project:", error);
    //   // Handle the error appropriately
    // }
  };
  
  return (
    <div className='max-h-lvh'>
      <Dashboard
        Projects={projects}
        serverSession={serverSession}
        addProject={addProject}
      />
    </div>
  );
};

export default ProjectsPage;
