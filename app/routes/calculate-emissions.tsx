import React, { useState } from "react";

import Calculator, {
  FormData,
  defaultFormData,
} from "../components/calculator.tsx";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  return json({ success: true }, { headers });
};

const CalculateEmissionsPage = () => {
  const initialFormState: FormData = defaultFormData(
    // Use these two cities as examples for the user. Maybe change later.
    { city: "Copenhagen", country: "" },
    { city: "", country: "" }
  );

  const [formData, setFormData] = useState<FormData>(initialFormState);

  return (
    <div className=" min-h-screen flex items-center justify-center">
      <Calculator
        isCreateProject={false}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default CalculateEmissionsPage;
