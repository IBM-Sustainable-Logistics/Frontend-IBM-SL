import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/deno"; 


const backendUrl = "https://ibm-sl-api.deno.dev/";


export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  if (request.method !== "GET") {
    return new Response("Invalid method", { status: 405 });
  }

  const url = new URL(`${backendUrl}api/estimate`);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    if (res.status === 400) {
      return res;
    }

    console.log(res.status)
    return new Response("Error fetching articles", { status: res.status });
  }

  return res;
};


export const action = async ({
  request
}: ActionFunctionArgs) => {
  switch (request.method) {
    case "POST": {
      const body = await request.json();

      const url = new URL(`${backendUrl}api/estimate`);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      switch (res.status) {
        case 200:
          return res;
        // We expect the response to be 400, if some of the parameters were incorrect
        case 400:
          return res;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return res;
    }
  }
};



