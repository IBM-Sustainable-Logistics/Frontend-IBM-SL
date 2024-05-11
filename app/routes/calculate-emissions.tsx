import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import Calculator, * as C from "../components/calculator/Calculator.tsx";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/deno";
import { getSupabaseWithSessionAndHeaders } from "../lib/supabase-server.ts";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  return json({ success: true }, { headers });
};

const CalculateEmissionsPage = () => {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unloadHandler = (event: BeforeUnloadEvent) => {
        event.preventDefault();
    };
    window.addEventListener('beforeunload', unloadHandler);

    return () => {
      window.removeEventListener('beforeunload', unloadHandler);
    };
  }, [location]);

  const initialChain: C.Chain = C.defaultChain(
    // Use these two cities as examples for the user. Maybe change later.
    { city: "", country: "" },
    { city: "", country: "" }
  );

  const [chain, setChain] = useState<C.Chain>(initialChain);

  window.onbeforeunload = function () {
    return true;
  };

  return (
    <div className=" min-h-screen flex items-center justify-center">
      <Calculator
        isProject={false}
        projectTitle={undefined}
        chain={chain}
        setChain={setChain}
      />
    </div>
  );
};

export default CalculateEmissionsPage;
