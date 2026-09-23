import Link from "next/link";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import SubscribeForm from "../../components/SubscribeForm";
import ContactInnerArea from "./components/ContactInnerArea";
import { ChevronRight } from "lucide-react";
import JsonLdScript from "@/components/security/JsonLdScript";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const normalizedSiteUrl = (SITE_URL || '').replace(/\/$/, '');
const canonical = `${normalizedSiteUrl}/contact-us`;

export default function ContactUsPage() {
    const organizationId = normalizedSiteUrl
        ? `${normalizedSiteUrl}/#organization`
        : '#organization';

    const schemaJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'ContactPage',
                name: 'Contact Us',
                url: canonical,
                about: {
                    '@id': organizationId,
                },
                contactPoint: [
                    {
                        '@type': 'ContactPoint',
                        email: 'info@akoode.com',
                        telephone: '+91-9899300017',
                        contactType: 'customer service',
                    },
                ],
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: normalizedSiteUrl || '/',
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Contact Us',
                        item: canonical,
                    },
                ],
            },
        ],
    };

    return (
        <>
            <JsonLdScript id="schema-contact" data={schemaJsonLd} />
            <NavBar />

            <div
                className="pt-[120px] pb-[60px] md:pt-32 md:pb-20 bg-center bg-no-repeat bg-cover bg-[url('/inner-bg.webp')]"
            >
                <div className="w-full mx-auto px-[15px] min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px] min-[1400px]:max-w-[1320px]">
                    <div className="flex justify-center">
                        <div className="w-full max-w-lg text-center">
                            <h1 className="text-2xl md:text-[42px] font-semibold mb-4 md:mb-8 font-sans text-white">
                                Contact <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#2A2B44_0%,#4A5175_25%,#00F6FF_50%,#4A5175_75%,#2A2B44_100%)] bg-[length:200%_auto] animate-text-shine">
                                    Us
                                </span>
                            </h1>
                            <p className="text-white/90 text-sm md:text-base">
                                <Link className="hometag hover:text-white transition-colors" href="/">
                                    Home</Link> <ChevronRight className="mx-2 text-[10px] inline-block align-middle" size={12} strokeWidth={3} />{" "}
                                <span className="text-white font-semibold">Contact Us</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <ContactInnerArea />
            <SubscribeForm />
            <Footer />
        </>
    );
}
