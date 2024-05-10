import { useRevalidator } from "@remix-run/react";
import { createBrowserClient } from "https://esm.sh/@supabase/ssr@0.1.0";
import type { Session, SupabaseClient } from  "https://esm.sh/@supabase/supabase-js@2.39.7";
import type { Database } from "./utils/types.ts";
import { useEffect, useState } from "react";

export type TypedSupabaseClient = SupabaseClient<Database>;

export type SupabaseOutletContext = {
  supabase: TypedSupabaseClient;
  domainUrl: string;
};

type SupabaseEnv = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};


export type SiginOutletContext = {
  setOpenSign: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
};
type UseSupabase = {
  env: SupabaseEnv;
  serverSession: Session | null;
};

export const useSupabase = ({ env, serverSession }: UseSupabase) => {
  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!)
  );
  const serverAccessToken = serverSession?.access_token;
  const revalidator = useRevalidator();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        // Revalidate the app.
        revalidator.revalidate();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, serverAccessToken, revalidator]);

  return { supabase };
};