import React, { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import pluginConfig from "./CookieConsentConfig.ts";
import "vanilla-cookieconsent/dist/cookieconsent.css";

const CookieConsentComponent = () => {
  useEffect(() => {
    CookieConsent.run(pluginConfig);
  }, []);

  return (
    <a
      className="text-xs hover:underline underline-offset-4"
      href="#"
      onClick={CookieConsent.showPreferences}
    >
      Show Cookie Preferences
    </a>
  );
};

export default CookieConsentComponent;
