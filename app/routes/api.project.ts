import type { ActionFunctionArgs } from "@remix-run/deno";
import { redirect, json } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";
import { deleteProject, insertProject, updateProject } from "../lib/supabase-client.ts";



export async function action({ request }: ActionFunctionArgs) {


  switch (request.method) {
    case "POST": {
        const { supabase, headers, serverSession } =
        await getSupabaseWithSessionAndHeaders({
          request,
        });
    
        if (!serverSession) {
          return redirect("/login", { headers });
        }
      
        const formData = await request.formData();
        const title = formData.get("title")?.toString();
        const description = formData.get("descriptionProject")?.toString();
        const userId = formData.get("userId")?.toString();
        const calc = formData.get("calc");
      
      
      if (!userId || !title || !description) {
          return json(
              { error: "Post/user information missing" },
              { status: 400, headers }
          );
      }
      
      const { error } = await insertProject(
          title,
          description,
          userId,
          calc
      );

      
      if (error) {
          return json(
              { error: "Failed create new project" },
              { status: 500, headers }
          );
      }
  
      return redirect("/projects");
    }
    case "DELETE": {
      const { supabase, headers, serverSession } =
      await getSupabaseWithSessionAndHeaders({
        request,
      });
  
      if (!serverSession) {
        return redirect("/login", { headers });
      }
    
      const formData = await request.formData();
      const projectId = formData.get("projId")?.toString();
    
      if (!projectId) {
        return json(
            { error: "Project information missing" },
            { status: 400, headers }
        );
      }
    
      const { error } = await deleteProject(
        projectId,
      );
    
      if (error) {
        return json(
            { error: "Failed to delete project" },
            { status: 500, headers }
        );
      }
  
      return json({ ok: true, error: null }, { headers });
    } 
    case "PATCH": {
      const { supabase, headers, serverSession } =
      await getSupabaseWithSessionAndHeaders({
        request,
      });
    
      const formData = await request.formData();
      const projectId = formData.get("projId")?.toString();
      console.log(formData.get("calc"));

      if (!projectId) {
        return json(
            { error: "Project information missing" },
            { status: 400, headers }
        );
      }

      const { error } = await updateProject(
        projectId,
        {
          title: formData.get("title")?.toString(),
          description: formData.get("descriptionProject")?.toString(),
          calculation: formData.get("calc"),
        }
      );
    
      if (error) {
        return json(
            { error: "Failed to delete project" },
            { status: 500, headers }
        );
      }
      
    
     
    
  
      return json({ ok: true, error: null }, { headers });
    }   
  }

}
