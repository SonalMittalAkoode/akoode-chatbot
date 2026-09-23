'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { m, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/Button'
import { hasHtmlContent, sanitizeRichText } from '@/utils/safeRichText'
import { resolveImageAlt } from '@/utils/imageAlt'

const buildAssetUrl = path => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
    (typeof process !== 'undefined' &&
      process.env?.NEXT_PUBLIC_FRONTEND_API_URL) ||
    ''
  if (!base) {
    return path.startsWith('/') ? path : `/${path}`
  }
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}

const renderParagraph = (text, className = '') => {
  if (!text) return null
  if (hasHtmlContent(text)) {
    return (
      <div
        className={`prose prose-sm max-w-none [&_a]:text-[#474972] [&_a]:underline ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizeRichText(text) }}
      />
    )
  }
  return <p className={className}>{text}</p>
}

const FadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

const FadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

const StaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function TechnologySectionArea({ service }) {
  const [backendIndex, setBackendIndex] = useState(0)
  const [cardsToShow, setCardsToShow] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCardsToShow(1)
      else if (window.innerWidth < 1024) setCardsToShow(2)
      else setCardsToShow(3)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!service) return null

  const allTechnologySteps = Array.isArray(service?.technologystep)
    ? service.technologystep
    : []

  // Frontend Technology Section
  const frontendShow = service?.frontendtechnologyhow || false
  const frontendTitle = service?.frontendtechnologytitle || ''
  const frontendDescription = service?.frontendtechnologydescription || ''
  const frontendImage = buildAssetUrl(service?.frontendtechnologyimage)
  const frontendSteps = allTechnologySteps.filter(
    step => step?.section === 'frontend' || (!step?.section && frontendShow)
  )

  // Backend Technology Section
  const backendShow = service?.backendtechnologyhow || false
  const backendTitle = service?.backendtechnologytitle || ''
  const backendDescription = service?.backendtechnologydescription || ''
  const backendImage = buildAssetUrl(service?.backendtechnologyimage)
  const backendSteps = allTechnologySteps.filter(
    step => step?.section === 'backend'
  )

  // Database Technology Section
  const databaseShow = service?.databasetechnologyhow || false
  const databaseTitle = service?.databasetechnologytitle || ''
  const databaseDescription = service?.backendtechnologydescription || ''
  const databaseDescriptionFinal = service?.databasetechnologydescription || ''
  const databaseImage = buildAssetUrl(service?.databasetechnologyimage)
  const databaseSteps = allTechnologySteps.filter(
    step => step?.section === 'database'
  )

  const hasFrontendContent =
    frontendShow ||
    (frontendTitle && String(frontendTitle).trim()) ||
    (frontendDescription && String(frontendDescription).trim()) ||
    frontendImage ||
    frontendSteps.length > 0
  const hasBackendContent =
    backendShow ||
    (backendTitle && String(backendTitle).trim()) ||
    (backendDescription && String(backendDescription).trim()) ||
    backendImage ||
    backendSteps.length > 0
  const hasDatabaseContent =
    databaseShow ||
    (databaseTitle && String(databaseTitle).trim()) ||
    (databaseDescriptionFinal && String(databaseDescriptionFinal).trim()) ||
    databaseImage ||
    databaseSteps.length > 0

  const totalBackendSlides = Math.max(0, backendSteps.length - cardsToShow + 1)

  const getGridConfig = count => {
    const configs = {
      4: { container: 'grid lg:grid-cols-2 gap-6', item: () => '' },
      5: {
        container: 'grid lg:grid-cols-6 gap-6',
        item: i => (i < 2 ? 'lg:col-span-3' : 'lg:col-span-2')
      },
      6: { container: 'grid lg:grid-cols-3 gap-6', item: () => '' },
      7: {
        container: 'grid lg:grid-cols-6 gap-6',
        item: i => (i < 3 ? 'lg:col-span-2' : 'lg:col-span-3')
      },
      8: { container: 'grid lg:grid-cols-4 gap-6', item: () => '' }
    }
    return configs[count] || { container: 'flex flex-col gap-6', item: () => '' }
  }

  const nextBackend = () => {
    setBackendIndex(prev => (prev + 1) % totalBackendSlides)
  }

  const prevBackend = () => {
    setBackendIndex(
      prev => (prev - 1 + totalBackendSlides) % totalBackendSlides
    )
  }

  if (!hasFrontendContent && !hasBackendContent && !hasDatabaseContent) {
    return null
  }

  const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

  return (
    <div className='overflow-hidden font-figtree'>
      {/* SEO: backend technology steps render through a carousel that only shows the
          visible window; this sr-only block lists every step in the DOM so crawlers
          index the full backend technology list. */}
      {backendSteps.length > 0 && (
        <div className='sr-only'>
          {backendTitle && <h3>{stripHtml(backendTitle)}</h3>}
          {backendSteps.map((step, i) => (
            <div key={`seo-backend-${step?._id || step?.id || i}`}>
              {step?.title && <h4>{stripHtml(step.title)}</h4>}
              {step?.description && <p>{stripHtml(step.description)}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Frontend Technology Section */}
      {hasFrontendContent && (
        <section className='py-20 md:py-[70px] bg-[#f8faff]'>
          <div className='container mx-auto px-[2rem] md:px-[70px]'>
            <div className='max-w-3xl mx-auto text-center mb-16'>
              <h2 className="text-[#1a1a1a] font-bold text-[24px] sm:text-[28px] leading-tight sm:leading-8 transition-colors duration-400">
                {frontendTitle || 'Frontend Technology'}
              </h2>
              {frontendDescription && (
                <div className='mt-6 text-[#505169] text-[18px] leading-relaxed'>
                  {renderParagraph(frontendDescription)}
                </div>
              )}
            </div>

            <div className='gap-12 items-center'>
              {frontendSteps.length > 0 && (
                <m.div
                  className={`order-2 lg:order-1 ${frontendImage ? 'lg:col-span-7' : 'lg:col-span-12'
                    } ${getGridConfig(frontendSteps.length).container}`}
                  variants={StaggerContainer}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                >
                  {frontendSteps.map((step, index) => (
                    <m.div
                      key={step._id || step.id || index}
                      variants={FadeInLeft}
                      className={`relative z-[1] bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-800 overflow-hidden group after:content-[''] after:absolute after:inset-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] after:-z-10 after:opacity-0 after:transition-all after:duration-500 hover:after:rounded-2xl hover:after:w-full hover:after:opacity-100 ${getGridConfig(frontendSteps.length).item(index)
                        }`}
                    >
                      <div className='content-area'>
                        {step.title && (
                          <h3 className='text-xl font-bold text-[#010225] mb-3 group-hover:text-white transition-colors duration-400'>
                            {step.title}
                          </h3>
                        )}
                        {step.description &&
                          renderParagraph(
                            step.description,
                            'text-[#656784] text-[15px] leading-relaxed group-hover:text-white group-hover:opacity-90 transition-colors duration-400'
                          )}
                      </div>
                    </m.div>
                  ))}
                </m.div>
              )}
              {/* {frontendImage && (
                <m.div
                  className={
                    frontendSteps.length > 0
                      ? 'lg:col-span-5'
                      : 'lg:col-span-12'
                  }
                  variants={FadeInRight}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                >
                  <div className='relative w-full rounded-3xl overflow-hidden shadow-2xl'>
                    <Image
                      src={frontendImage}
                      alt={resolveImageAlt(service?.frontendtechnologyimagealt, frontendTitle || 'Frontend Technology')}
                      width={1200}
                      height={2000}
                      sizes='(max-width: 1024px) 100vw, 42vw'
                      className='object-contain'
                    />
                  </div>
                </m.div>
              )} */}
            </div>
          </div>
        </section>
      )}

      {/* Backend Technology Section - Carousel */}
      {hasBackendContent && (
        <section
          className={`py-14 md:py-[70px] ${hasFrontendContent ? 'bg-white' : 'bg-[#f8faff]'
            }`}
        >
          <div className='container font-figtree mx-auto px-[2rem] md:px-[70px]'>
            <div className='relative flex flex-col items-center mb-8 md:mb-16 gap-6'>
              <div className='max-w-3xl text-center mx-auto'>
                <h2 className="text-[#1a1a1a] font-bold text-[24px] sm:text-[28px] leading-tight sm:leading-8 transition-colors duration-400">
                  {backendTitle || 'Backend Technology'}
                </h2>
                {backendDescription && (
                  <div className='mt-6 text-[#505169] text-[18px] leading-relaxed'>
                    {renderParagraph(backendDescription)}
                  </div>
                )}
              </div>

              {totalBackendSlides > 1 && (
                <div className='hidden md:flex gap-4 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2'>
                  <button
                    onClick={prevBackend}
                    className='w-12 h-12 cursor-pointer rounded-full bg-[#474972] flex items-center justify-center text-white hover:bg-[#585c9c] transition-all active:scale-95 shadow-lg'
                    aria-label='Previous slide'
                  >
                    <ChevronLeft size={16} aria-hidden />
                  </button>
                  <button
                    onClick={nextBackend}
                    className='w-12 h-12 cursor-pointer rounded-full bg-[#474972] flex items-center justify-center text-white hover:bg-[#585c9c] transition-all active:scale-95 shadow-lg'
                    aria-label='Next slide'
                  >
                    <ChevronRight size={16} aria-hidden />
                  </button>
                </div>
              )}
            </div>

            {backendSteps.length > 0 && (
              <div className='relative overflow-hidden'>
                <m.div
                  className='flex gap-8'
                  drag='x'
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, { offset }) => {
                    const swipe = Math.abs(offset.x) > 50
                    if (swipe && totalBackendSlides > 1) {
                      if (offset.x > 0) prevBackend()
                      else nextBackend()
                    }
                  }}
                >
                  <AnimatePresence mode='popLayout' initial={false}>
                    {backendSteps
                      .slice(backendIndex, backendIndex + cardsToShow)
                      .map((step, index) => (
                    <m.div
                      key={step._id || step.id || index}
                          layout
                          initial={{ opacity: 0, scale: 0.9, x: 20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9, x: -20 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                          className="relative z-[1] flex-1 min-w-0 bg-[#f8faff] p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-800 overflow-hidden group after:content-[''] after:absolute after:inset-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] after:-z-10 after:opacity-0 after:transition-all after:duration-500 hover:after:rounded-2xl hover:after:w-full hover:after:opacity-100"
                          style={{ flexBasis: `${100 / cardsToShow}%` }}
                    >
                      <div className='content-area h-full flex flex-col'>
                        {step.title && (
                          <h3 className='text-xl font-bold text-[#010225] mb-4 group-hover:text-white transition-colors duration-400'>
                            {step.title}
                          </h3>
                        )}
                        {step.description &&
                          renderParagraph(
                            step.description,
                            'text-[#656784] text-[15px] leading-relaxed flex-1 group-hover:text-white group-hover:opacity-90 transition-colors duration-400'
                          )}
                      </div>
                    </m.div>
                  ))}
                  </AnimatePresence>
                </m.div>
              </div>
            )}

            {/* Mobile nav buttons — shown below the cards on small screens */}
            {totalBackendSlides > 1 && (
              <div className='flex md:hidden justify-center gap-4 mt-6'>
                <button
                  onClick={prevBackend}
                  className='w-12 h-12 cursor-pointer rounded-full bg-[#474972] flex items-center justify-center text-white hover:bg-[#585c9c] transition-all active:scale-95 shadow-lg'
                  aria-label='Previous slide'
                >
                  <ChevronLeft size={16} aria-hidden />
                </button>
                <button
                  onClick={nextBackend}
                  className='w-12 h-12 cursor-pointer rounded-full bg-[#474972] flex items-center justify-center text-white hover:bg-[#585c9c] transition-all active:scale-95 shadow-lg'
                  aria-label='Next slide'
                >
                  <ChevronRight size={16} aria-hidden />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Database Technology Section */}
      {hasDatabaseContent && (
        <section className='py-16 md:py-[70px] bg-[#f8faff] border-t border-gray-100'>
          <div className='container mx-auto px-[2rem] md:px-[70px]'>
            <div className='max-w-3xl mx-auto text-center mb-16'>
              <h2 className="text-[#1a1a1a] font-bold text-[24px] sm:text-[28px] leading-tight sm:leading-8 transition-colors duration-400">
                {databaseTitle || 'Database Technology'}
              </h2>
              {databaseDescriptionFinal && (
                <div className='mt-6 text-[#505169] text-[18px] leading-relaxed'>
                  {renderParagraph(databaseDescriptionFinal)}
                </div>
              )}
            </div>

            <div className='grid lg:grid-cols-12 gap-12 items-center'>
              {databaseImage && (
                <m.div
                  className='lg:col-span-6 lg:order-last'
                  variants={FadeInRight}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                >
                  <div className='relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl'>
                    <Image
                      src={databaseImage}
                      alt={resolveImageAlt(service?.databasetechnologyimagealt, databaseTitle || 'Database Technology')}
                      fill
                      sizes='(max-width: 1024px) 100vw, 50vw'
                      className='object-cover'
                    />
                  </div>
                </m.div>
              )}
              <m.div
                className={databaseImage ? 'lg:col-span-6' : 'lg:col-span-12'}
                variants={StaggerContainer}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true }}
              >
                <div className='space-y-4'>
                  {databaseSteps.map((step, index) => (
                    <m.div
                      key={step._id || step.id || index}
                      variants={FadeInLeft}
                      className="relative z-[1] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-800 overflow-hidden group after:content-[''] after:absolute after:inset-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] after:-z-10 after:opacity-0 after:transition-all after:duration-500 hover:after:rounded-2xl hover:after:w-full hover:after:opacity-100"
                    >
                      <div className='content-area'>
                        {step.title && (
                          <h3 className='text-xl font-bold text-[#010225] mb-2 font-figtree group-hover:text-white transition-colors duration-400'>
                            {step.title}
                          </h3>
                        )}
                        {step.description &&
                          renderParagraph(
                            step.description,
                            'text-[#656784] text-[15px] leading-relaxed font-figtree group-hover:text-white group-hover:opacity-90 transition-colors duration-400'
                          )}
                      </div>
                    </m.div>
                  ))}
                </div>
              </m.div>
            </div>
            <m.div
              className='mt-12 text-center'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Button text='Start Your Project Now' href='/post-requirement' />
            </m.div>
          </div>
        </section>
      )}
    </div>
  )
}
