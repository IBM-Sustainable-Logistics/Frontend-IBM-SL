import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { load } from "https://deno.land/std@0.218.0/dotenv/mod.ts";
import type { Database } from './types.ts'


const env = await load();

export const supabase = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)

