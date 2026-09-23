import Link from "next/link";
import { ChevronRight } from "lucide-react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import PrivacyPolicyInnerArea from './components/PrivacyPolicyInnerArea';
import { normalizedSiteUrl } from "@/utils/seo";
import JsonLdScript from "@/components/security/JsonLdScript";

const canonical = `${normalizedSiteUrl}/privacy-policy`;

const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebPage",
            "@id": `${canonical}#webpage`,
            url: canonical,
            name: "Privacy Policy | Akoode Technologies",
            description: "Read Akoode Technologies' Privacy Policy to understand how we collect, use, and protect your personal information.",
            publisher: {
                "@type": "Organization",
                name: "Akoode Technologies",
                url: normalizedSiteUrl,
            },
        },
        {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: normalizedSiteUrl },
                { "@type": "ListItem", position: 2, name: "Privacy Policy", item: canonical },
            ],
        },
    ],
};

export default function PrivacyPolicyPage() {
    return (
        <>
            <JsonLdScript id="schema-privacy-policy" data={schemaJsonLd} />
            <NavBar />

            <div
                className="pt-[120px] pb-[60px] md:pt-32 md:pb-20 bg-center bg-no-repeat bg-cover bg-[url('/inner-bg.webp')]"
            >
                <div className="w-full mx-auto px-[15px] min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px] min-[1400px]:max-w-[1320px]">
                    <div className="flex justify-center">
                        <div className="w-full max-w-lg text-center">
                            <h1 className="text-2xl md:text-[42px] font-semibold mb-4 md:mb-8 font-sans text-white">
                                Privacy <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#2A2B44_0%,#4A5175_25%,#00F6FF_50%,#4A5175_75%,#2A2B44_100%)] bg-[length:200%_auto] animate-text-shine">
                                    Policy
                                </span>
                            </h1>
                            <p className="text-white/90 text-sm md:text-base">
                                <Link className="hometag hover:text-white transition-colors" href="/">
                                    Home</Link> <ChevronRight className="mx-2 text-[10px] inline-block align-middle stroke-[5px]" size={12}  />{" "}
                                <span className="text-white font-semibold">Privacy Policy</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <PrivacyPolicyInnerArea />

            <Footer />
        </>
    );
}
