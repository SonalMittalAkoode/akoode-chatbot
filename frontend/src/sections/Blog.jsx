'use client'
import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react'
import { m } from 'framer-motion'
import SectionBadge from '@/components/SectionBadge'
import Button from '@/components/Button'


const formatBlogDate = dateString => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

export default function Blog({ blogs: blogsProp = [] }) {
  const headingText = 'Insights, Ideas, and Expertise Straight from Our Team'
  const blogs = Array.isArray(blogsProp) ? blogsProp : []

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

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  const [index, setIndex] = useState(0)
  const [cardsToShow, setCardsToShow] = useState(1)
  const [isDragging, setIsDragging] = useState(false)

  const intervalRef = useRef(null)

  const total = blogs.length
  const infiniteData = [...blogs, ...blogs]

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) return
      if (window.innerWidth >= 768) {
        setCardsToShow(2)
      } else {
        setCardsToShow(1)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isDragging || total === 0) return

    intervalRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % total)
    }, 4000)

    return () => clearInterval(intervalRef.current)
  }, [isDragging, total])

  const next = () => {
    if (total === 0) return
    setIndex(prev => (prev + 1) % total)
  }
  const prev = () => {
    if (total === 0) return
    setIndex(prev => (prev - 1 + total) % total)
  }

  if (blogs.length === 0) {
    return null
  }

  return (
    <section className='md:py-14 py-8 bg-white'>
      <div className='max-w-6xl mx-auto px-6'>
        <div className='text-center mb-8 md:mb-12'>
          <SectionBadge text='Blogs' variant='light' />
          <m.h2
            variants={headingVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='text-xl md:text-[22px] font-bold text-[#1E293B] leading-tight mt-4'
          >
            {headingText.split('').map((char, index) => (
              <m.span key={index} variants={letterVariants}>
                {char}
              </m.span>
            ))}
          </m.h2>
        </div>

        {/* Desktop Grid ≥ 992px */}
        <div className='hidden min-[992px]:grid grid-cols-3 gap-6'>
          {blogs.map((blog, i) => (
            <div key={i} className='relative flex flex-col'>
              <div className='relative overflow-hidden rounded-xl h-64'>
                <Image
                  src={`${apiUrl}${blog.logoimage}`}
                  fill
                  sizes="(max-width: 992px) 100vw, 33vw"
                  className='object-cover'
                  alt={blog.title}
                />
              </div>
              <div className='relative bg-white mx-6 md:mx-10 -mt-[100px] p-4 rounded-[8px] shadow-sm min-h-[180px]'>
                <div className='mb-4'>
                  <span className='inline-flex items-center gap-2 text-[#474972] text-[14px] font-medium bg-[#6f69f7]/20 px-[10px] py-[6px] rounded-[4px]'>
                    <Image src='/calendar.svg' width={16} height={16} alt='Calendar icon' />
                    {formatBlogDate(blog.createdAt)}
                  </span>
                </div>
                <h3 className='text-md font-semibold text-gray-800'>
                  <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Slider < 992px */}
        <div className='min-[992px]:hidden overflow-hidden'>
          <m.div
            className='flex will-change-transform'
            drag='x'
            dragElastic={0.15}
            dragMomentum={true}
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e, info) => {
              setIsDragging(false)
              const threshold = 80

              if (info.offset.x < -threshold) next()
              if (info.offset.x > threshold) prev()
            }}
            animate={{
              x: `-${index * (100 / cardsToShow)}%`
            }}
            transition={{
              type: 'spring',
              stiffness: 90,
              damping: 20
            }}
          >
            {infiniteData.map((blog, i) => (
              <div
                key={i}
                style={{ width: `${100 / cardsToShow}%` }}
                className='flex-shrink-0 px-3'
              >
                <div className='relative flex flex-col'>
                  <div className='relative overflow-hidden rounded-xl h-56'>
                    <Image
                      src={`${apiUrl}${blog.logoimage}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className='object-cover'
                      alt={blog.title}
                    />
                  </div>

                  <div className='relative bg-white mx-6 md:mx-8 -mt-[70px] p-4 rounded-[8px] shadow-sm min-h-[180px]'>
                    <div className='mb-3'>
                      <span className='inline-flex items-center gap-2 text-[#474972] text-[14px] font-medium bg-[#6f69f7]/20 px-[8px] py-[4px] rounded-[4px]'>
                        <Image src='/calendar.svg' width={16} height={16} alt='Calendar icon' />
                        {formatBlogDate(blog.createdAt)}
                      </span>
                    </div>

                    <h3 className='text-[16px] font-semibold text-gray-900'>
                      <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </m.div>

          {/* Pagination Dots - 44px min touch target for accessibility */}
          <div className='flex justify-center mt-8 gap-3'>
            {blogs.map((_, i) => {
              const active = index === i
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to blog ${i + 1}`}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full touch-manipulation"
                >
                  <span
                    className={`h-2 rounded-full transition-all duration-300 flex-shrink-0 ${active ? 'w-8 bg-[#4f5284]' : 'w-2 bg-gray-300'}`}
                    aria-hidden
                  />
                </button>
              )
            })}
          </div>
        </div>
        <div className='flex justify-center mt-6'>
          <Link href='/blog'>
            <Button text='View All Blogs' variant='primary' />
          </Link>
        </div>
      </div>
    </section>
  )
}
 