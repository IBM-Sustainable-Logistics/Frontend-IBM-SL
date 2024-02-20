import * as React from "react";
import type { MetaFunction } from "@remix-run/deno";

export const meta: MetaFunction = () => {
  return [
    { title: "IBM SL" },
    { name: "description", content: "Welcome to SL" },
  ];
};

export default function Index() {
  return <div></div>;
}
