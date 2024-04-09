import React from "react";

import ProjectOverview from "../components/projectoverview.tsx";
import { useLoaderData, useParams } from "@remix-run/react";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";
import { getProject } from "../lib/supabase-client.ts";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  const params = useParams();

  const project = await getProject(params.toString());

  if (!serverSession) {
    return redirect("/signin", { headers });
  }

  const userId = serverSession.user.id;

  return json({ success: true, project, userId }, { headers });
};

const ProjectById = () => {
  const { project, userId } = useLoaderData<typeof loader>();

  return (
    <div className="max-h-lvh">
      <ProjectOverview />
    </div>
  );
};

export default ProjectById;
