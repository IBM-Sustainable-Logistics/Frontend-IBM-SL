import React from "react";

import ProjectOverview from "../components/projectoverview.tsx";
import { json, LoaderFunctionArgs, redirect } from "@remix-run/deno";
import { getProjects, getSingleProject } from "../lib/supabase-client.ts";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";
import { useLoaderData, useParams } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  const url = new URL(request.url);
  const projectId = url.pathname.split("/").pop();

  const project = await getSingleProject(projectId ? projectId : "");

  console.log(project);

  if (!serverSession) {
    return redirect("/signin", { headers });
  }

  const userId = serverSession.user.id;

  return json({ success: true, project, userId }, { headers });
};

const ProjectById = () => {
  const { project, userId } = useLoaderData<typeof loader>();

  return <ProjectOverview project={project} />;
};

export default ProjectById;
