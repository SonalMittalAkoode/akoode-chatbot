"use client";

import { Smartphone } from "lucide-react";
import CategoryCasesSection from "./CategoryCasesSection";
import { categoryHref } from "@/config/caseStudyCategories";

/* Mobile App Development — case studies whose hero Type is
   "Mobile App Development". Cards are passed in from the server. */
export default function MobileAppSection({ items = [] }) {
    if (!items.length) return null;
    return (
        <CategoryCasesSection
            id="mobile-app-cases"
            icon={Smartphone}
            headingDark="Mobile App"
            headingLight="Development"
            items={items}
            viewAllHref={categoryHref("mobile-app-development")}
            sectionBgClassName="bg-white"
        />
    );
}
