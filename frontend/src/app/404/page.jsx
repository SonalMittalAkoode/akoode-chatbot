import Header from '@/components/NavBar';
import ErrorPageContent from '@/app/404/components/ErrorPageContent';
import Footer from '@/components/Footer';

export const metadata = {
  title: '404 - Page Not Found | Akoode',
  description: 'The page you are looking for could not be found.',
};

export default function ErrorPage() {
  return (
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
                  404 - Page <span>Not Found</span>
                </h1>
                <div className="h-7" aria-hidden />
                <p className="text-white font-figtree text-2xl font-medium leading-6">
                  <a
                    href="/"
                    className="text-white text-center font-figtree text-[24px] font-medium leading-6 inline-block transition-all duration-400 hover:opacity-90"
                  >
                    Home
                  </a>{' '}
                  <i className="fa-solid fa-angle-right" aria-hidden /> <span>404</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ErrorPageContent />
      <Footer />
    </main>
  );
}