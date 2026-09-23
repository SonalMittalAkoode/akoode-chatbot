"use client";

import { Sparkles } from "lucide-react";
import CategoryCasesSection from "./CategoryCasesSection";
import { categoryHref } from "@/config/caseStudyCategories";

/* Artificial Intelligence — case studies whose hero Type is
   "Artificial Intelligence". Cards are passed in from the server. */
export default function ArtificialIntelligenceSection({ items = [], searchItems }) {
    if (!items.length) return null;
    return (
        <CategoryCasesSection
            id="artificial-intelligence-cases"
            icon={Sparkles}
            headingDark="Artificial"
            headingLight="Intelligence"
            items={items}
            viewAllHref={categoryHref("artificial-intelligence")}
            sectionBgClassName="bg-[#F4F5FA]"
            searchItems={searchItems}
        />
    );
}
