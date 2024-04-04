import { useState } from "react";

import Calculator from "../components/calculator.tsx";
import { LoaderFunctionArgs, json } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  if (serverSession) {
    console.log(serverSession, { headers });
  }

  return json({ success: true }, { headers });
};

type FormStage = {
  transportMethod: string;
  distance?: number;
  from: string;
  to: string;
};

type FormData = {
  stages: FormStage[];
  emissions: number | null;
};

const CalculateEmissionsPage = () => {
  const initialFormState: FormData = {
    stages: [
      {
        transportMethod: "",
        distance: 0,
        from: "",
        to: "",
      },
    ],
    emissions: null,
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);

  return (
    <div className=' min-h-screen flex items-center justify-center'>
      <Calculator isCreateProject={false} getContent="" />
    </div>
  );
};

export default CalculateEmissionsPage;
