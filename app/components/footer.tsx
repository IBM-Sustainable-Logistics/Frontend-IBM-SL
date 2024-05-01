import { Link } from "@remix-run/react";
import React from "react";
import CookieConsentComponent from "./cookies/CookieConsent.tsx";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <div className="flex items-center gap-4"></div>

      <div className="mt-4 sm:mt-0 flex items-center gap-4">
        <Link className="text-xs hover:underline underline-offset-4" to="#">
          Terms of Service
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" to="#">
          Privacy Policy
        </Link>
        <CookieConsentComponent />
      </div>
    </footer>
  );
}
