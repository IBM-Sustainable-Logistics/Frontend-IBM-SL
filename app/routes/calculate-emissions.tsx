import React from "react";

import Calculator from "../components/calculator.tsx";

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, serverSession } = await getSupabaseWithSessionAndHeaders({
    request,
  });

  if (serverSession) {
    return redirect("/signup", { headers });
  }

  return json({ success: true }, { headers });
};

const CalculateEmissionsPage = () => {
  return (
    <div className=" min-h-screen flex items-center justify-center">
      <Calculator />
    </div>
  );
};

export default CalculateEmissionsPage;
