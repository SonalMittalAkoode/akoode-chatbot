'use client';

import { useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import ThankyouInnerContent from './ThankyouInnerContent';

const VALID_TYPES = ['contact', 'post-requirement', 'job-application', 'general-enquiry'];

export default function ThankYouPageClient() {
  const searchParams = useSearchParams();
  const type = searchParams?.get('type');

  if (!type || !VALID_TYPES.includes(type)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fcfdfc]">
      <div
        className="relative z-[1] overflow-hidden bg-center bg-no-repeat bg-cover pt-[120px] pb-[60px] md:pt-[138px] md:pb-[76px]"
        style={{ backgroundImage: 'url(/inner-bg.webp)' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center">
            <div className="w-full max-w-[33.333%] min-[992px]:max-w-none min-[992px]:w-1/3 mx-auto">
              <div className="inner-header text-center">
                <h1 className="text-white font-figtree text-2xl md:text-[42px] font-semibold leading-tight md:leading-[64px] tracking-[-0.54px]">
                  Thank{' '}
                  <span
                    className="inline-block font-medium bg-[length:200%_auto] bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(90deg, #2a2b44 0%, #4a5175 25%, #00f6ff 60%, #4a5175 80%, #2a2b44 100%)',
                      animation: 'textShine 4s linear infinite',
                    }}
                  >
                    You
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ThankyouInnerContent type={type} />
    </div>
  );
}
