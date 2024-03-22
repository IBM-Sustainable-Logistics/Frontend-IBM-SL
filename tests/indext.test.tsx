import { json } from "@remix-run/deno";
import { useLoaderData } from "@remix-run/react";
import { createRemixStub } from "@remix-run/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { assert } from "https://deno.land/std@0.128.0/_util/assert.ts";
import React from "https://esm.sh/react@18.2.0";

Deno.test("renders loader data", async () => {
  function MyComponent() {
    const data = useLoaderData() as { message: string };
    return <p>Message: {data.message}</p>;
  }

  const RemixStub = createRemixStub([
    {
      path: "/",
      Component: MyComponent,
      loader() {
        return json({ message: "hello" });
      },
    },
  ]);

  render(<RemixStub />);

  await waitFor(() => {
    assert(screen.getByText("Message: hello"));
  });
});
