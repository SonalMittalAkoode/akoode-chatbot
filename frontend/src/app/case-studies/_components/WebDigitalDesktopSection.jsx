"use client";

import { LayoutGrid } from "lucide-react";
import CategoryCasesSection from "./CategoryCasesSection";
import { categoryHref } from "@/config/caseStudyCategories";

/* Web, Digital & Desktop Solutions — case studies whose hero Type is
   "Website Development", "Digital Transformation" or "Desktop Application".
   Cards are passed in from the server. */
export default function WebDigitalDesktopSection({ items = [] }) {
    if (!items.length) return null;
    return (
        <CategoryCasesSection
            id="web-digital-desktop-cases"
            icon={LayoutGrid}
            headingDark="Web, Digital &"
            headingLight="Desktop Solutions"
            items={items}
            viewAllHref={categoryHref("web-digital-desktop")}
            sectionBgClassName="bg-white"
        />
    );
}
