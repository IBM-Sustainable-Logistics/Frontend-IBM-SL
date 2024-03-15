import { createClient } from  "https://esm.sh/@supabase/supabase-js@2.39.7";
import type { Database } from "./utils/types.ts";
import { load } from "https://deno.land/std@0.218.0/dotenv/mod.ts";
import { project } from "./Transport.ts";


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
    return await supabase.from('estimates').select('*')
}

export async function getProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select(`
            *,
            projects_transports (
                *,
                transports (
                    *
                )
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
    
    console.log("Fetched projects with transports:", data);
    return data;
}

export async function insertProject (project: project) {
    const { data, error } = await supabase.from('projects').insert([project]);

    if (error) {
        console.error("Error adding project:", error);
        return;
    }

    console.log("Added project:", data);
}




