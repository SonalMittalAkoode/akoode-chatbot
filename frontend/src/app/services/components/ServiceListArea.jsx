'use client';

import Link from 'next/link';
import Image from 'next/image';
import resolveImageUrl from '@/utils/resolveImageUrl';
import { useState } from 'react';
import { ArrowRight, Plus } from "lucide-react";
import { getServiceFilterData } from '@/api/frontend/services';
import { resolveImageAlt } from '@/utils/imageAlt';

const stripHtml = (value) => {
  if (!value) return '';
  return String(value).replace(/<[^>]*>/g, '').trim();
};

const resolveServiceImage = (service) => {
  const rawImage =
    service?.logoimage ||
    service?.icon ||
    service?.featuredimageurl?.url ||
    service?.featuredimageurl ||
    service?.image ||
    service?.aboutimage;
  return resolveImageUrl(rawImage) || '/images/services/software-development.svg';
};

export default function ServiceListArea({
  services = [],
  totalServices = 0,
}) {
  const [displayedServices, setDisplayedServices] = useState(
    Array.isArray(services) ? services : []
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // Backend skip formula: (page-1)*limit. After first 9, next 3 starts at page 4.
  const [nextPage, setNextPage] = useState(4);

  const hasData = displayedServices.length > 0;
  const showButton = displayedServices.length < totalServices;

  const handleLoadMore = async () => {
    if (isLoadingMore || !showButton) return;
    setIsLoadingMore(true);
    try {
      const response = await getServiceFilterData({ limit: 3, page: nextPage });
      const newServices = Array.isArray(response?.items) ? response.items : [];
      if (newServices.length > 0) {
        setDisplayedServices((prev) => [...prev, ...newServices]);
        setNextPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to load more services:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="relative z-[1] py-10 md:py-[70px] bg-white">
      <div className="container mx-auto px-[2rem] md:px-[70px] font-figtree">
        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasData ? (
            displayedServices.map((service, index) => {
              const slug = service?.slug || '';
              // Card heading: prefer admin "Services Tag" (`project`), same as NavBar mega-menu
              const title = stripHtml(service?.project || service?.title || 'Service');
              const description = stripHtml(
                service?.shortdescription || service?.description || ''
              );
              const imageUrl = resolveServiceImage(service);

              return (
                <div key={service?._id || service?.id || slug || index} className="flex">
                  <div className="relative z-10 w-full h-full flex flex-col rounded-2xl bg-white p-4 mb-[0px] min-h-[100px] overflow-hidden shadow-[0_0.25rem_0.75rem_rgba(0,0,0,0.05)] transition-all duration-800 hover:shadow-[0_4px_40px_rgba(0,0,0,0.09)] group after:content-[''] after:absolute after:inset-0 after:left-1/2 after:-translate-x-1/2 after:w-[10px] after:bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] after:-z-10 after:opacity-0 after:transition-all after:duration-500 hover:after:rounded-xl hover:after:w-full hover:after:opacity-100">
                    <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] shrink-0 transition-all duration-400 group-hover:scale-110 group-hover:bg-white mb-3">
                    <Image
                        src={imageUrl}
                        alt={resolveImageAlt(service?.logoimagealt || service?.aboutimagealt, title)}
                        width={30}
                        height={30}
                        className="max-w-[30px] max-h-[30px] object-contain transition-all duration-400"
                      />
                    </div>
                    {slug ? (
                      <Link href={`/services/${slug}`} className="text-[#1a1a1a] font-semibold text-[18px] leading-8 min-h-[45px] line-clamp-3 transition-colors duration-400 group-hover:text-white">
                        {title}
                      </Link>
                    ) : (
                      <h3 className="text-[#1a1a1a] font-semibold text-[18px] leading-8 min-h-[45px] line-clamp-3 transition-colors duration-400 group-hover:text-white">{title}</h3>
                    )}
                    {description && (
                      <div>
                        <p className="text-[#37385C] text-[14px] leading-[22px] line-clamp-6 flex-1 transition-colors duration-400 group-hover:text-white group-hover:opacity-80">{description}</p>
                      </div>
                    )}
                    {slug && (
                      <div className="absolute -right-[100px] -top-[100px] transition-all duration-[400ms] group-hover:top-4 group-hover:right-4">

                        <Link
                          href={`/services/${slug}`}
                          className="h-[40px] w-[40px] inline-flex items-center justify-center bg-white text-[#474972] rounded-full -rotate-45 hover:rotate-0 transition-transform duration-300"
                          aria-label={`View ${title}`}
                        >
                          <ArrowRight />
                        </Link>

                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full">
              <div className="text-center py-12 text-gray-500">
                <p>No services available at the moment.</p>
              </div>
            </div>
          )}
        </div>

        {showButton && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="relative z-10 overflow-hidden inline-flex items-center justify-center gap-2 px-7 py-2 rounded-lg bg-white text-[#474972] font-bold border border-[#474972]/10 shadow-sm transition-all duration-400 cursor-pointer after:content-[''] after:absolute after:inset-y-0 after:left-1/2 after:-translate-x-1/2 after:w-[10px] after:bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] after:-z-10 after:opacity-0 after:transition-all after:duration-400 hover:text-white hover:after:w-full hover:after:rounded-lg hover:after:opacity-100"
            >
              {isLoadingMore ? "Loading..." : "View More"} <Plus className="inline-block ml-1" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

