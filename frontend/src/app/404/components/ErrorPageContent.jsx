'use client';
import Image from 'next/image';

export default function ErrorPageContent() {
  const btnClass =
    "relative inline-block py-[18px] px-[18px] rounded-lg text-white bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] z-[1] font-figtree text-[20px] leading-5 font-bold transition-all duration-400 hover:text-white hover:-translate-y-[5px] after:content-[''] after:absolute after:inset-y-0 after:left-1/2 after:-translate-x-1/2 after:h-full after:w-[10px] after:rounded-lg after:bg-[linear-gradient(90deg,#585c9c_0%,#474972_100%)] after:transition-all after:duration-400 after:-z-10 after:invisible after:opacity-0 hover:after:visible hover:after:opacity-100 hover:after:w-full hover:after:left-0 hover:after:translate-x-0";

  return (
    <div className="error-page-area py-[50px] md:py-[70px] bg-[#fcfdfc]">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full max-w-[66.666%] min-[992px]:max-w-none min-[992px]:w-2/3 mx-auto">
            <div className="error-page-content text-center">
              <div className="error-number flex justify-center">
               <Image
                  src="/error.webp"
                  alt="404 Error"
                  width={300}
                  height={300}
                  className="max-w-[300px] w-full h-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] mx-auto"
                />
              </div>
              <div className="h-5" aria-hidden />
              <h2 className="text-[#2a2b44] font-figtree text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] font-semibold transition-all duration-400 mb-5">
                Ohh! Page Not Found
              </h2>
              <p className="text-[18px] text-[#666] mb-[30px] leading-[1.6]">
                We can't seem to find the page you're looking for
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                <a href="/" className={btnClass}>
                  Go Back Home <i className="fa-solid fa-arrow-right" aria-hidden />
                </a>
                <a href="/contact-us" className={btnClass}>
                  Contact Us <i className="fa-solid fa-arrow-right" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

