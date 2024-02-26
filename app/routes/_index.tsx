import * as React from "react";
import type { MetaFunction } from "@remix-run/deno";
import { Button } from "../components/ui/button.tsx";
import { GitHub } from "../lib/Icons.tsx";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "IBM SL" },
    { name: "description", content: "Welcome to SL" },
  ];
};

export default function Index() {
  return (
    <div className=" flex flex-col justify-center items-center h-screen gap-6 bg-background font-mono">
      <h1 className="text-5xl lg:text-6xl font-bold">Coming Soon</h1>
      <Link to="https://github.com/IBM-Sustainable-Logistics">
        <Button variant={"ibm_blue"} className="flex gap-2">
          {GitHub()} View on Github
        </Button>{" "}
      </Link>
    </div>
  );
}
