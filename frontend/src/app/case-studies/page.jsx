import Image from "next/image";
import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { Globe, Monitor, ArrowRight } from "lucide-react";

import NavBar from "@/components/NavBar";
import ArtificialIntelligenceSection from "./_components/ArtificialIntelligenceSection";
import MobileAppSection from "./_components/MobileAppSection";
import SoftwareDevSection from "./_components/SoftwareDevSection";
import WebDigitalDesktopSection from "./_components/WebDigitalDesktopSection";
import Footer from "@/components/Footer";
import CaseStudyList from "./components/CaseStudyList";
import { getCasestudyList } from "@/api/frontend/casestudy";
import { getCaseStudyLatestList } from "@/api/caseStudyLatest";
import SubscribeForm from "@/components/SubscribeForm";
import { buildCanonical, normalizedSiteUrl, twitterSite } from "@/utils/seo";
import { groupCaseStudiesByType, toCard } from "./_lib/groupCaseStudies";
import { getCategoryBySlug, categoryHref } from "@/config/caseStudyCategories";
import AwardsPanel from "@/components/AwardsPanel";
import FounderCtaStrip from "@/components/FounderCtaStrip";
import FinalCTA from "@/components/FinalCTA";
import resolveImageUrl from "@/utils/resolveImageUrl";

const caseStudyTitle = "Case Studies | AI, Custom Software & Mobile App Success Stories | Akoode";
const caseStudyDescription =
    "Discover real-world AI, custom software, web, and mobile app success stories from Akoode. Learn how our digital solutions deliver measurable results for businesses worldwide.";
const caseStudyOgImage = `${normalizedSiteUrl}/caseStudy/caseStudy_OG.png`;

export const metadata = {
    title: caseStudyTitle,
    description: caseStudyDescription,
    alternates: { canonical: buildCanonical("/case-studies") },
    openGraph: {
        title: caseStudyTitle,
        description: caseStudyDescription,
        url: buildCanonical("/case-studies"),
        siteName: "Akoode Technologies",
        type: "website",
        images: [
            {
                url: caseStudyOgImage,
                width: 1200,
                height: 630,
                alt: caseStudyTitle,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: caseStudyTitle,
        description: caseStudyDescription,
        images: [caseStudyOgImage],
        site: twitterSite,
    },
};

/** First value of a search param that may arrive as string | string[]. */
function firstParam(value) {
    if (Array.isArray(value)) return value[0] || "";
    return typeof value === "string" ? value : "";
}

/** Legacy ?page= URLs collapse onto the canonical listing. */
function redirectIfPageQueryParam(params) {
    if (!params || !Object.prototype.hasOwnProperty.call(params, "page")) return;
    const usp = new URLSearchParams();
    for (const [key, raw] of Object.entries(params)) {
        if (key === "page") continue;
        if (raw === undefined) continue;
        const vals = Array.isArray(raw) ? raw : [raw];
        for (const v of vals) usp.append(key, String(v));
    }
    const q = usp.toString();
    permanentRedirect(q ? `/case-studies?${q}` : "/case-studies");
}

function CaseStudyHero() {
    return (
        <section
            aria-label="Case study hero"
            className="relative overflow-hidden bg-[linear-gradient(180deg,#1F2336_0%,#141127_100%)] font-figtree"
        >
            {/* Arch background group */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[8%] w-[200%] -translate-x-1/2 select-none sm:top-[6%] sm:w-full sm:min-w-[760px] lg:top-[1%] lg:w-[82%] xl:w-[80%]"
            >
                <div className="relative aspect-[1404/874]">
                    <Image
                        src="/caseStudy/ellipse%204.svg"
                        alt="ellipse background"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 70vw"
                        className="object-contain"
                    />
                    <Image
                        src="/caseStudy/ellipse%206.svg"
                        alt="ellipse background"
                        width={1169}
                        height={764}
                        className="absolute left-[8.55%] top-[12.7%] h-[87.4%] w-[83.26%] object-contain "
                    />
                    <Image
                        src="/caseStudy/ellipse%203.svg"
                        alt="ellipse background"
                        width={1024}
                        height={694}
                        className="absolute left-[13.68%] top-[20.6%] h-[79.4%] w-[72.93%] object-contain"
                    />
                </div>
            </div>

            {/* Bottom fade — melts the clipped arch glow into the #141127
                section below so there's no visible seam between them */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-48 bg-[linear-gradient(180deg,transparent_0%,#141127_100%)]"
            />

            {/* Phone-only dark radial behind the copy so text stays readable
                where the arch glow passes behind it on narrow screens */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 sm:hidden bg-[radial-gradient(ellipse_60%_35%_at_50%_52%,rgba(19,15,37,0.85)_0%,rgba(19,15,37,0.4)_55%,transparent_100%)]"
            />

            <div className="relative z-10 mx-auto flex min-h-[max(520px,100svh)] w-full max-w-[955px] flex-col items-center justify-center gap-3 px-5 pb-[90px] pt-[110px] text-center sm:gap-2.5 md:min-h-[max(640px,100svh)] md:pb-[96px] md:pt-[110px] lg:min-h-[max(700px,100svh)] lg:pt-[220px]">
                <h1 className="font-figtree font-normal capitalize leading-[1.15] tracking-[0] text-[clamp(1.625rem,3.3vw,3.1rem)] sm:leading-[1.04]">
                    <span className="bg-[linear-gradient(90deg,#7784C5_3%,#B7BEED_30%,#6077EC_50%,#7683C5_100%),linear-gradient(90deg,#C1C4D1_0%,#00116A_100%)] bg-clip-text text-transparent">
                        Real Problems. Real Clients.
                    </span>
                    <br />
                    <span className="text-white">
                        Platforms That Are Still Running.
                    </span>
                </h1>
                {/* Figma: ~17px Figtree, narrow measure so it wraps to two centered lines */}
                <p className="max-w-[620px] font-figtree font-normal leading-[1.4] text-white text-[clamp(0.9375rem,1.25vw,1.125rem)]">
                    Case studies across AI, custom software development, and mobile app development. Every
                    project shows the problem, the approach, and what shipped.
                </p>
            </div>
        </section>
    );
}

function FeaturedCaseStudy({ featured }) {
    // Fallback static data if no dynamic featured case study is available
    const heading = featured?.hero?.heroHeading || featured?.title || "AI Hair Analysis Platform";
    const accent = featured?.hero?.heroHeadingAccent || "";
    const titleText = featured?.title || "AI Hair Analysis Platform For A US Hair Transport Clinic";
    
    const rawImg = featured?.hero?.listingImage || featured?.hero?.heroImage || "/caseStudy/what_we_build.png";
    const imgUrl = resolveImageUrl(rawImg);
    const imgAlt = featured?.hero?.heroImageAlt || featured?.title || "AI hair analysis platform shown on desktop and mobile devices";
    
    const description = featured?.hero?.heroBody || featured?.hero?.body
        ? String(featured?.hero?.heroBody || featured?.hero?.body).replace(/<[^>]*>/g, "").trim()
        : "Replaced verbal consultations with a computer-vision-powered 3D simulation system, improving patient confidence before treatment.";

    const chipSlugify = (str) =>
        String(str || "")
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");

    const rawChips = featured?.hero?.metaChips || [];
    // One chip per LABEL, with every value for that label listed inside it —
    // "Services - A, B", not "Services - A" beside "Services - B". A chip with
    // several services selected in the admin is still a single chip, which is
    // how the case study detail hero renders it too.
    const tagGroups = [];
    const groupFor = (label) => {
        let group = tagGroups.find((g) => g.label === label);
        if (!group) {
            group = { label, values: [] };
            tagGroups.push(group);
        }
        return group;
    };
    const filteredChips = rawChips.filter((c) => ["Industry", "Services"].includes(c?.label));

    for (const chip of filteredChips) {
        const label = chip.label;
        const group = groupFor(label);

        if (Array.isArray(chip.services) && chip.services.length > 0) {
            for (const s of chip.services) {
                if (s?.name) {
                    group.values.push({
                        value: s.name,
                        link: s.link || `/services-v2/${chipSlugify(s.name)}`,
                    });
                }
            }
        } else if (chip.value) {
            const values = String(chip.value).split(",").map((v) => v.trim()).filter(Boolean);
            for (const val of values) {
                let link = chip.link;
                if (!link) {
                    if (label.toLowerCase() === "industry") {
                        link = `/industries/${chipSlugify(val)}`;
                    } else if (label.toLowerCase() === "services") {
                        link = `/services-v2/${chipSlugify(val)}`;
                    } else {
                        link = "#";
                    }
                }
                group.values.push({ value: val, link });
            }
        }
    }

    // A chip whose label matched but which carried no usable value would leave
    // an empty group behind, rendering a bare "Services -" with nothing after it.
    const tagItems = tagGroups.filter((g) => g.values.length > 0);

    if (tagItems.length === 0) {
        tagItems.push(
            { label: "Services", values: [{ value: "Software Development", link: "/services-v2/software-development" }] },
            { label: "Industry", values: [{ value: "Education", link: "/industries/education" }] }
        );
    }

    const countryVal = (featured?.hero?.metaChips || []).find(c => c.label === "Country" || c.label === "Client")?.value || "";
    const typeVal = (featured?.hero?.metaChips || []).find(c => c.label === "Type")?.value || "";

    const details = [];
    if (countryVal) {
        details.push({ id: "country", label: "Client/Country", value: countryVal, Icon: Globe, bordered: !!typeVal });
    }
    if (typeVal) {
        details.push({ id: "type", label: "Type", value: typeVal, Icon: Monitor, bordered: false });
    }
    
    // Fallback details if none are available from the dynamic data
    if (details.length === 0 && !featured) {
        details.push({ id: "country", label: "Country", value: "United States", Icon: Globe, bordered: true });
        details.push({ id: "type", label: "Type", value: "Mobile + Web", Icon: Monitor, bordered: false });
    }

    const detailLink = featured?.slug ? `/case-studies/${featured.slug}` : "/case-studies";

    return (
        <section
            aria-labelledby="featured-case-study-title"
            className="bg-[#141127] font-figtree"
        >
            <div className="mx-auto grid w-full max-w-[1630px] grid-cols-1 items-center gap-8 px-5 pb-12 pt-8 sm:gap-10 sm:px-8 sm:pb-16 sm:pt-10 lg:grid-cols-[47%_1fr] lg:gap-[clamp(2.5rem,5vw,5.9375rem)] lg:px-[clamp(2rem,7vw,8.5rem)] lg:pb-24 lg:pt-6">
                {/* Device mockup */}
                <div className="relative flex w-full aspect-[754/580] max-h-[480px] sm:max-h-[540px] lg:max-h-[600px] items-center justify-center overflow-hidden rounded-[32px] bg-[#1a1733]/30 md:rounded-[48px]">
                    <img
                        src={imgUrl}
                        alt={imgAlt}
                        className="h-full w-full object-contain rounded-[32px] md:rounded-[48px]"
                    />
                </div>

                {/* Copy */}
                <div className="flex flex-col items-start gap-[22px]">
                    {tagItems.length > 0 && (
                        <ul className="m-0 flex list-none flex-wrap items-center gap-3 p-0 sm:gap-4">
                            {tagItems.map((item, idx) => (
                                <li
                                    key={`${item.label}-${idx}`}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/70 bg-transparent px-3 py-1.5 text-center font-normal text-white text-[12px] sm:text-[14px] leading-tight"
                                >
                                    <span className="shrink-0 text-white/80">{item.label} -</span>
                                    <span>
                                        {item.values.map((v, k) => (
                                            <span key={`${v.value}-${k}`}>
                                                {k > 0 ? <span className="text-white/60">, </span> : null}
                                                {v.link && v.link !== "#" ? (
                                                    <Link
                                                        href={v.link}
                                                        className="text-white underline decoration-white/60 underline-offset-4 hover:text-[#B7BEED] hover:decoration-[#B7BEED] transition-colors font-medium"
                                                    >
                                                        {v.value}
                                                    </Link>
                                                ) : (
                                                    <span className="text-white font-medium">{v.value}</span>
                                                )}
                                            </span>
                                        ))}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <h2
                        id="featured-case-study-title"
                        className="font-normal capitalize leading-[1.2] tracking-[0] text-[clamp(1.5rem,2.4vw,2.5rem)]"
                    >
                        {accent ? (
                            <>
                                <span className="bg-[linear-gradient(90deg,#7784C5_3%,#B7BEED_30%,#6077EC_50%,#7683C5_100%)] bg-clip-text text-transparent">
                                    {heading}
                                </span>
                                <br />
                                <span className="text-white">
                                    {accent}
                                </span>
                            </>
                        ) : (
                            <span className="bg-[linear-gradient(90deg,#7784C5_3%,#B7BEED_30%,#6077EC_50%,#7683C5_100%)] bg-clip-text text-transparent">
                                {titleText}
                            </span>
                        )}
                    </h2>

                    {/* Clamped to two lines. The hero body is written for the case study detail
                        page, so on the listing it is a teaser — line-clamp keeps it to two lines
                        at every width (and adds its own ellipsis) rather than a character count
                        that would still wrap to three lines on a narrow viewport. */}
                    <p className="line-clamp-2 max-w-[826px] font-normal leading-[1.3] text-white text-[clamp(0.9375rem,1.25vw,1.5rem)]">
                        {description}
                    </p>

                    <div className="flex flex-col items-start">
                        {details.map(({ id, label, value, Icon, bordered }) => (
                            <div
                                key={id}
                                className={`flex w-full max-w-[306px] items-center gap-3.5 p-[12px] sm:p-[15px] ${
                                    bordered
                                        ? "border-b-[1.67px] border-solid border-[#d3ddff]/40"
                                        : ""
                                }`}
                            >
                                <span
                                    aria-hidden="true"
                                    className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#edeefe] sm:h-[60px] sm:w-[60px]"
                                >
                                    <Icon
                                        strokeWidth={1.8}
                                        className="h-[26px] w-[26px] text-[#5971fc] sm:h-[30px] sm:w-[30px]"
                                    />
                                </span>
                                <span className="flex min-w-0 flex-col items-start">
                                    <span className="font-medium text-[#9da3ae] text-[clamp(0.9375rem,1vw,1.125rem)] leading-tight">
                                        {label}
                                    </span>
                                    {id === "type" ? (
                                        <span className="mt-0.5 flex flex-col gap-0.5">
                                            {String(value)
                                                .split(",")
                                                .map((t) => t.trim())
                                                .filter(Boolean)
                                                .map((t, idx, arr) => (
                                                    <span
                                                        key={idx}
                                                        className="font-medium text-white text-[clamp(1rem,1.1vw,1.25rem)] leading-[1.3]"
                                                    >
                                                        {t}
                                                        {idx < arr.length - 1 ? "," : ""}
                                                    </span>
                                                ))}
                                        </span>
                                    ) : (
                                        <span className="font-medium text-white text-[clamp(1.125rem,1.25vw,1.5rem)] leading-[1.3] break-words">
                                            {value}
                                        </span>
                                    )}
                                </span>
                            </div>
                        ))}

                        <div className="p-[12px] sm:p-[15px]">
                            <Link
                                href={detailLink}
                                aria-label={`Read the ${heading} case study`}
                                className="group inline-flex items-center gap-[13px] border-b-[1.67px] border-solid border-[#5971fc] pb-2 font-medium text-[#5971fc] text-[clamp(1.125rem,1.25vw,1.5rem)] leading-[1.3]"
                            >
                                Read Case Study
                                <ArrowRight
                                    strokeWidth={1.8}
                                    className="h-[24px] w-[24px] transition-transform duration-300 group-hover:translate-x-1.5 sm:h-[30px] sm:w-[30px]"
                                    aria-hidden="true"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


export default async function CaseStudiesPage({ searchParams }) {
    const sp = (await searchParams) || {};

    // Legacy ?type=<slug> links now live at /case-studies/category/<slug>.
    const legacyCategory = getCategoryBySlug(firstParam(sp.type));
    if (legacyCategory) permanentRedirect(categoryHref(legacyCategory.slug));

    redirectIfPageQueryParam(sp);

    const limit = 6;
    const [caseStudyResponse, latestList] = await Promise.all([
        getCasestudyList(1, limit),
        getCaseStudyLatestList().catch(() => []),
    ]);

    const oldCaseStudies = caseStudyResponse?.data || [];
    const oldTotal = caseStudyResponse?.total ?? oldCaseStudies.length;

    const sortedLatest = [...(Array.isArray(latestList) ? latestList : [])].sort(
        (a, b) =>
            new Date(b?.createdAt || 0).getTime() -
            new Date(a?.createdAt || 0).getTime()
    );

    const latestCards = sortedLatest.map((d) => ({
        _id: d?._id,
        slug: d?.slug,
        title: d?.title,
        casestudyimage: d?.hero?.listingImage || d?.hero?.heroImage || "",
        shortdescription: d?.meta?.description || "",
        aboutdescription: d?.hero?.body || d?.meta?.description || "",
        createdAt: d?.createdAt,
        updatedAt: d?.updatedAt,
    }));

    const latestSlugs = new Set(latestCards.map((c) => c.slug).filter(Boolean));
    const oldFiltered = oldCaseStudies.filter((c) => !latestSlugs.has(c?.slug));

    const caseStudies = [...latestCards, ...oldFiltered];
    const totalCaseStudies = oldTotal + latestCards.length;

    // Group case studies into the four listing categories by their hero `Type`.
    const casesByCategory = groupCaseStudiesByType(sortedLatest);

    // Flat, deduped list of every active case study on this page (not just
    // one category's cards) — feeds the AI section's search bar.
    const searchItems = Array.from(
        new Map(sortedLatest.map((doc) => [doc?.slug || doc?._id, toCard(doc)])).values()
    );

    return (
        <>
            <NavBar forceTransparent />
            <CaseStudyHero />
            <FeaturedCaseStudy featured={sortedLatest[0]} />
            <ArtificialIntelligenceSection items={casesByCategory.ai} searchItems={searchItems} />
            <MobileAppSection items={casesByCategory.mobile} />
            <SoftwareDevSection items={casesByCategory.software} />
            <WebDigitalDesktopSection items={casesByCategory.webDigitalDesktop} />
            <section
                className="py-16 sm:py-20 lg:py-24 font-figtree"
                style={{
                    background: "linear-gradient(160deg, #f5f3fa 0%, #ebe9f4 50%, #f0eef8 100%)",
                }}
            >
                <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
                    <AwardsPanel />
                    <div className="mt-8">
                        <FounderCtaStrip />
                    </div>
                </div>
            </section>
            <FinalCTA
                variant="dark"
                service="Case Studies Overview"
                pageContext={{
                    pageType: "case-studies",
                }}
                data={{
                    eyebrow: "GET IN TOUCH",
                    heading: "Let's build something",
                    headingAccent: "extraordinary",
                    subtitle: "Ready to accelerate your custom software, mobile app, or AI development? Reach out today to discuss your vision with an expert engineer.",
                }}
            />
            {/* <CaseStudyList
                caseStudies={caseStudies}
                totalCaseStudies={totalCaseStudies}
            /> */}
            <SubscribeForm />
            <Footer />
        </>
    );
}
