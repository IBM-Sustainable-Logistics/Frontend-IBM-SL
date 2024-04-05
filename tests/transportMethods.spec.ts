import {
  assertEquals,
} from "https://deno.land/std@0.221.0/testing/asserts.ts";
import {
  isTruckTransportMethod,
  getTransportMethodLabel,
} from "../app/lib/Transport.ts";

Deno.test("isTruckTransportMethod should return true for truck transport methods", () => {
  assertEquals(isTruckTransportMethod("truck"), true);
  assertEquals(isTruckTransportMethod("etruck"), true);
});

Deno.test("isTruckTransportMethod should return false for non-truck transport methods", () => {
  assertEquals(isTruckTransportMethod("train"), false);
  assertEquals(isTruckTransportMethod("aircraft"), false);
});

Deno.test("getTransportMethodLabel should return the correct label for each transport method", () => {
  assertEquals(getTransportMethodLabel("truck"), "Truck");
  assertEquals(getTransportMethodLabel("etruck"), "Electric Truck");
});
// Use the following command to run the tests:
// deno test --allow-read --allow-net tests/transportMethods.spec.ts

