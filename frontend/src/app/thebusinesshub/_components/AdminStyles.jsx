"use client";

import { useEffect } from "react";

const ADMIN_STYLES = [
  "/admin/css/main.css",
  "/admin/css/dashbord_navitaion.css",
  "/admin/css/ace-responsive-menu.css",
];

const ID = "akoode-admin-styles";

export default function AdminStyles() {
  useEffect(() => {
    ADMIN_STYLES.forEach((href, index) => {
      const id = `${ID}-${index}`;
      if (document.getElementById(id)) return;

      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    });

    return () => {
      ADMIN_STYLES.forEach((_, index) => {
        const el = document.getElementById(`${ID}-${index}`);
        if (el) el.remove();
      });
    };
  }, []);

  return null;
}
