/* ------------------------------------------------------------------ *
 *  Redesigned Case Study detail page.
 *
 *  Composes the section components. With no `doc` (the static demo at
 *  /case-study-v2) every section renders its hardcoded defaults. With a
 *  `doc` (the dynamic /case-study-v2/[slug] route) each section renders
 *  from the saved record and only sections with `show: true` are output.
 *  Each section lives in ./_components; shared primitives in ./_components/shared.
 * ------------------------------------------------------------------ */

import HeroSection from "./_components/HeroSection";
import RethinkingSection from "./_components/RethinkingSection";
import ChallengesSection from "./_components/ChallengesSection";
import BuildSection from "./_components/BuildSection";
import PipelineSection from "./_components/PipelineSection";
import PowerfulSection from "./_components/PowerfulSection";
import TechStackSection from "./_components/TechStackSection";
import KeyChallengesSection from "./_components/KeyChallengesSection";
import WhatChangedSection from "./_components/WhatChangedSection";
import AnalyticsSection from "./_components/AnalyticsSection";
import WhyChooseSection from "./_components/WhyChooseSection";

export default function CaseStudyV2({ doc = null }) {
  // Without a record: render everything (static demo).
  // With a record: a section shows only when its `show` flag is true.
  const show = (key) => !doc || !!doc?.[key]?.show;

  return (
    <main className="bg-white font-figtree overflow-x-clip">
      {show("hero") && <HeroSection data={doc?.hero} />}
      {show("rethinking") && <RethinkingSection data={doc?.rethinking} />}
      {show("challenges") && <ChallengesSection data={doc?.challenges} />}
      {show("build") && <BuildSection data={doc?.build} />}
      {show("pipeline") && <PipelineSection data={doc?.pipeline} />}
      {show("powerful") && <PowerfulSection data={doc?.powerful} />}
      {show("techStack") && <TechStackSection data={doc?.techStack} />}
      {show("keyChallenges") && <KeyChallengesSection data={doc?.keyChallenges} />}
      {show("whatChanged") && <WhatChangedSection data={doc?.whatChanged} />}
      {show("analytics") && <AnalyticsSection data={doc?.analytics} />}
      {show("whyChoose") && <WhyChooseSection data={doc?.whyChoose} />}
    </main>
  );
}
