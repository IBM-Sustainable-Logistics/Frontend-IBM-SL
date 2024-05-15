import { Link } from "@remix-run/react";
import React from "react";
import CookieConsentComponent from "./cookies/CookieConsent.tsx";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row  w-full m-4 py-4 items-center   border-t">
      <div className="flex items-center gap-4"></div>

      <div className="mt-4 sm:mt-0 flex items-center gap-4">
        <Link className="text-xs hover:underline underline-offset-4" to="/terms">
          Terms of Service
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" to="/privacy">
          Privacy Policy
        </Link>
        <CookieConsentComponent />
      </div>
    </footer>
  );
}

