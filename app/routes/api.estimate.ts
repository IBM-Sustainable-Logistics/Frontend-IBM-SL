import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/deno"; 


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
        return new Response("Error fetching articles", { status: res.status });
      }
    
      const data = await res.json();
      return new Response(JSON.stringify(data), { status: 200 });
};


export const action = async ({
  request,
}: ActionFunctionArgs) => {
  switch (request.method) {
    case "POST": {
      const { list } = await request.json();

      const url = new URL(`${backendUrl}api/estimate`);
      
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"list": list}),
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
       
      return res.json();
    }
  }
};



