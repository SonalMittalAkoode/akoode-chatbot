"use client";

import { useEffect } from "react";

export default function ScriptsManager() {
  useEffect(() => {
    // Cookie consent temporarily disabled — GTM consent logic commented out

    // const consent = localStorage.getItem("akoode-cookie-consent");

    // const updateGtmConsent = (choice) => {
    //   if (typeof window.gtag !== "function") return;

    //   if (choice === "all") {
    //     window.gtag("consent", "update", {
    //       ad_storage: "granted",
    //       analytics_storage: "granted",
    //       personalization_storage: "granted",
    //       functionality_storage: "granted",
    //       security_storage: "granted",
    //     });
    //   }
    // };

    // if (consent === "all") {
    //   updateGtmConsent("all");
    // }

    // const handleConsentChange = (e) => {
    //   if (e.detail === "all") {
    //     updateGtmConsent("all");
    //   }
    // };

    // window.addEventListener("akoode-consent-updated", handleConsentChange);
    // return () => window.removeEventListener("akoode-consent-updated", handleConsentChange);
  }, []);

  return null;
}
