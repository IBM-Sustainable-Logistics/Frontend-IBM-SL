import { createClient } from  "https://esm.sh/@supabase/supabase-js@2.39.7";
import type { Database, Json } from "./utils/types.ts";
import { load } from "https://deno.land/std@0.218.0/dotenv/mod.ts";
import { project } from "./Transport.ts";
import * as uuid from "https://deno.land/std@0.207.0/uuid/mod.ts";


const env = await load();

const getSupabaseEnv =  () => (
    {
        SUPABASE_URL: Deno.env.get("SUPABASE_URL") || env["SUPABASE_URL"],
        SUPABASE_ANON_KEY: Deno.env.get("SUPABASE_ANON_KEY") || env["SUPABASE_ANON_KEY"],
      }
  );


const supabase = createClient<Database>(getSupabaseEnv().SUPABASE_URL, getSupabaseEnv().SUPABASE_ANON_KEY);

 
// add server side function here 


// example 
export async function getEstimates(){
    return await supabase.from('estimates').select(' id, created_at, title, description,user_id, description ')
}

export async function getProjects() {
    const { data, error } = await supabase
        .from('projects').select(' id, created_at, title, description,user_id, description, emissions: calculation->emissions').order('created_at', {ascending: false });

    if (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
    
    return data;
}

export async function insertProject (
    title: string,
    description: string | null,
    user_id: string,
    calculation: string,
) {

    const calcJson = JSON.parse(calculation);

    const { error } = await supabase.from('projects').insert(
        {
            title,
            description,
            user_id,
            calculation: calcJson,
        }
    );
    if (error) {
        console.error("Error inserting project:", error);
    }

    return { error };

}

export async function updateProject(
    projectId: string,
    updates: Partial<{
        title: string;
        description: string | null;
        calculation: string;
    }>
) {

    updates.calculation = JSON.parse(updates.calculation);

    const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId);
    if (error) {
        console.error("Error updating project:", error);
    }
    return { error };
}


export async function deleteProject(projectId: string) {
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    if (error) {
        console.error("Error deleting project:", error);
    }
    return { error };
}


export async function getSingleProject(projectId: string) {
    const { data, error } = await supabase
        .from('projects')
        .select(' id, created_at, title, description, user_id, description, emissions: calculation->emissions, stages: calculation->stages')
        .eq('id', projectId);
    if (error) {
        console.error("Error fetching project:", error);
        return null;
    }
    
    return data[0];
}

