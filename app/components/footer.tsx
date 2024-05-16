import { Link } from "@remix-run/react";
import React from "react";
import CookieConsentComponent from "./cookies/CookieConsent.tsx";
import { GitHub } from "../lib/Icons.tsx";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <div className="mt-4 sm:mt-0 flex flex-col md:flex-row items-center gap-6">
        <Link
          className="text-xs hover:underline underline-offset-4"
          to="/terms"
        >
          Terms of Service
        </Link>

        <Link
          className="text-xs hover:underline underline-offset-4"
          to="/privacy"
        >
          Privacy Policy
        </Link>
        <CookieConsentComponent />
        <Link
          className="text-xs hover:underline underline-offset-4"
          to="https://github.com/IBM-Sustainable-Logistics"
        >
          <div className="flex gap-2">
            View on GitHub <GitHub />
          </div>
        </Link>
        <Link
          className="text-xs hover:underline underline-offset-4"
          to="https://ibm-sl-api.deno.dev/"
        >
          Are you a developer ? Try our api
        </Link>
      </div>
    </footer>
  );
}
