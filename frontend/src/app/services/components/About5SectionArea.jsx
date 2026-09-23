'use client'

import Link from 'next/link'
import Button from '../../../components/Button'
import { m, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { hasHtmlContent, sanitizeRichText } from '@/utils/safeRichText'
import { resolveImageAlt } from '@/utils/imageAlt'

const buildAssetUrl = path => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
    ''
  if (!base) {
    return path.startsWith('/') ? path : `/${path}`
  }
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}

const headingVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02
    }
  }
}

const letterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0
  }
}

const normaliseToParagraphs = value => {
  if (!value) return []
  if (Array.isArray(value)) {
    return value
      .filter(Boolean)
      .map(item => item.toString().trim())
      .filter(Boolean)
  }
  if (typeof value === 'string') {
    return value
      .split(/\n+/)
      .map(part => part.trim())
      .filter(Boolean)
  }
  return []
}

export default function About5SectionArea ({
  eyebrow,
  tag,
  heading,
  description,
  secondaryDescription,
  image,
  imageAlt,
  ctaLabel = 'Get a Quote',
  ctaHref = '/contact-us'
}) {
  // Don't render if there's no content at all
  if (!heading && !tag && !description && !secondaryDescription && !image) {
    return null
  }

  const imageSrc = buildAssetUrl(image)
  const tagText = tag || ''
  const headingText = heading || ''

  const paragraphs = [
    ...normaliseToParagraphs(description),
    ...normaliseToParagraphs(secondaryDescription)
  ]

  // Only show paragraphs if they exist - no default content
  const copy = paragraphs
  const hasRichDescription = hasHtmlContent(description)

  return (
    <div className="relative z-[1] py-10 sm:py-14 md:py-[70px] bg-white">
      <div className="container mx-auto px-[2rem] md:px-8 lg:px-[70px]">
        <div className={`grid grid-cols-1 ${imageSrc ? "lg:grid-cols-2" : ""} gap-8 lg:gap-12 items-center font-figtree`}>
          {imageSrc && (
            <div className="w-full">
              <div className="relative overflow-hidden rounded-lg sm:rounded-[10px] w-full aspect-[4/3] lg:aspect-auto lg:h-[480px]">
                <Image
                  src={imageSrc}
                  alt={resolveImageAlt(imageAlt, headingText || 'About visual')}
                  fill
                  sizes='(max-width: 1024px) 100vw, 50vw'
                  className='object-cover rounded-lg sm:rounded-[10px]'
                />
              </div>
            </div>
          )}
          <div className="w-full">
            <div className="pr-0 lg:pr-[30px]">
              {/* Badge removed by request */}
              {headingText && (
                <>
                  <div className='h-3 sm:h-[18px]' />
                  <m.h2
                    variants={headingVariants}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    className="text-[#1a1a1a] font-bold text-[24px] sm:text-[28px] leading-tight sm:leading-8 transition-colors duration-400"
                  >
                    {headingText.split('').map((char, index) => (
                      <m.span key={index} variants={letterVariants}>
                        {char}
                      </m.span>
                    ))}
                  </m.h2>
                </>
              )}
              <div className='h-3 sm:h-[18px]' />
              {(copy.length > 0 || hasRichDescription) && (
                <>
                  {hasRichDescription ? (
                    <div
                      className='text-[#505169] text-[15px] sm:text-[16px] font-[500] leading-[1.5] sm:leading-[28px] space-y-4 sm:space-y-5 max-w-none [&_a]:text-[#474972] [&_a]:underline'
                      dangerouslySetInnerHTML={{ __html: sanitizeRichText(description) }}
                    />
                  ) : (
                    copy.map((paragraph, index) => (
                      <p
                        key={index}
                        className='text-[#505169] text-[15px] sm:text-[16px] md:text-[18px] font-[500] leading-[1.5] sm:leading-[28px] mb-3 sm:mb-4'
                      >
                        {paragraph}
                      </p>
                    ))
                  )}
                  <Button
                    text='Start Your Project Now'
                    href='/contact-us'
                    className='mt-3 sm:mt-4'
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
