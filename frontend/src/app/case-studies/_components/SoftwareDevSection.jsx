"use client";

import { Code2 } from "lucide-react";
import CategoryCasesSection from "./CategoryCasesSection";
import { categoryHref } from "@/config/caseStudyCategories";

/* Software Development — case studies whose hero Type is
   "Software Development". Cards are passed in from the server. */
export default function SoftwareDevSection({ items = [] }) {
    if (!items.length) return null;
    return (
        <CategoryCasesSection
            id="software-development-cases"
            icon={Code2}
            headingDark="Software"
            headingLight="Development"
            items={items}
            viewAllHref={categoryHref("software-development")}
            sectionBgClassName="bg-[#F4F5FA]"
        />
    );
}
