import { test, expect } from "@playwright/test";

const url = "https://ibm-sl-api.deno.dev/api/estimate";

test("fetch /api/estimate and get response 200", async () => {
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([
      {
        transport_form: "truck",
        distance_km: 300,
      },
    ]),
  });

  expect(resp.status).toBe(200); // Use response.ok() to check if the response is okay
});

test("fetch /api/estimate and get kg of truck to be 315", async () => {
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([
      {
        transport_form: "truck",
        distance_km: 300,
      },
    ]),
  });

  const body = await resp.json();
  expect(body.total_kg).toBe(315); // Check if the total_kg for truck is 315
});

test("fetch /api/estimate and get 6816 as total kg", async () => {
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([
      {
        transport_form: "truck",
        distance_km: 100,
      },
      {
        transport_form: "truck",
        from: {
          city: "New York",
          country: "United States",
        },
        to: {
          city: "Los Angeles",
        },
      },
      {
        transport_form: "etruck",
        distance_km: 100,
      },
      {
        transport_form: "train",
        distance_km: 500,
      },
      {
        transport_form: "aircraft",
        distance_km: 300,
      },
      {
        transport_form: "cargoship",
        distance_km: 300,
      },
    ]),
  });

  const body = await resp.json();
  expect(body.total_kg).toBe(6816); // Check if the total_kg is 6816
});

test("fetch /api/estimate and get total stages to 4", async () => {
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([
      {
        transport_form: "etruck",
        distance_km: 100,
      },
      {
        transport_form: "train",
        distance_km: 500,
      },
      {
        transport_form: "aircraft",
        distance_km: 300,
      },
      {
        transport_form: "cargoship",
        distance_km: 300,
      },
    ]),
  });

  const body = await resp.json();
  expect(body.stages.length).toBe(4); // Check if the number of stages is 4
});
