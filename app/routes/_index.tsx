import * as React from "react";
import type { MetaFunction } from "@remix-run/deno";

import Hero from "../components/hero.tsx";

export const meta: MetaFunction = () => {
  return [
    { title: "IBM SL" },
    { name: "description", content: "Welcome to SL" },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-6 bg-background font-mono">
      <Hero /> {/* Use the Hero component */}
    </div>
  );
}
