import Header from '@/components/NavBar';
import Footer from '@/components/Footer';
import ErrorPageContent from '@/app/404/components/ErrorPageContent';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
    title: '404 - Page Not Found | Akoode',
    description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#fcfdfc]">
            <main className="main">
                <Header />
            {/* Hero: .inner-page-hero-area — exact padding & background per extracted CSS */}
            <div
                className="relative z-[1] overflow-hidden bg-center bg-no-repeat bg-cover pt-[120px] pb-[60px] md:pt-[138px] md:pb-[76px]"
                style={{ backgroundImage: 'url(/inner-bg.webp)' }}
            >
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center">
                        <div className="w-full max-w-[33.333%] min-[992px]:max-w-none min-[992px]:w-1/3 mx-auto">
                            <div className="inner-header text-center">
                                <h1 className="text-white font-figtree text-2xl md:text-[42px] font-semibold leading-tight md:leading-[64px] tracking-[-0.54px]">
                                    Page{' '}
                                    <span
                                        className="inline-block font-medium bg-[length:200%_auto] bg-clip-text text-transparent text-[42px]"
                                        style={{
                                            backgroundImage:
                                                "linear-gradient(90deg, #2a2b44 0%, #4a5175 25%, #00f6ff 60%, #4a5175 80%, #2a2b44 100%)",
                                            animation: "textShine 4s linear infinite",
                                        }}
                                    >
                                        Not Found
                                    </span>
                                </h1>
                                {/* Breadcrumb */}
                                <p className="text-white/90 text-sm md:text-base mt-3">
                                    <Link
                                        className="hometag hover:text-white transition-colors"
                                        href="/"
                                    >
                                        Home
                                    </Link>
                                    <ChevronRight
                                        className="mx-2 text-[10px] inline-block align-center stroke-[5px]"
                                        size={12}
                                    />
                                    <span className="text-white font-semibold">404</span>
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <ErrorPageContent />
                <Footer />
            </main>
        </div>
    );
}

