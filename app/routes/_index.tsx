import * as React from "react";
import type { MetaFunction } from "@remix-run/deno";
import { Button } from "../components/ui/button.tsx";

export const meta: MetaFunction = () => {
  return [
    { title: "IBM SL" },
    { name: "description", content: "Welcome to SL" },
  ];
};

export default function Index() {
  return (
    <div className=" flex flex-col justify-center items-center h-screen gap-6">
      <h1 className=" text-4xl font-bold">Coming Soon</h1>
      <Button>View on Github</Button>
    </div>
  );
}
