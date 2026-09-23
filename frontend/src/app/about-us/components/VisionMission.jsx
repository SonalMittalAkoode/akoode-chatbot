'use client'

import Image from 'next/image'
import { m } from 'framer-motion'

/**
 * VisionMission Component
 *
 * Displays the company's Vision and Mission statements, a highlight quote,
 * a grid of key clients, and a section for awards and recognitions.
 *
 * Features:
 * - Parallax-style background image for the services section.
 * - Glassmorphism effect for content cards.
 * - Responsive grid layouts for clients and awards.
 * - Interactive hover effects on logos.
 */
export default function VisionMission () {
  const clients = [
    { name: 'Dapper Doughnut', src: '/clients/dapper-doughnut.png' },
    { name: 'Toni & Guy', src: '/clients/toni-guy.png' },
    { name: 'WeGrow', src: '/clients/logo-dark.png' },
    { name: 'GS Garry', src: '/clients/GsGarry.png' },
    { name: 'Mullen', src: '/clients/mullen.png' },
    { name: 'Vallo', src: '/clients/vallo-logo.svg' },
    { name: 'Patton', src: '/clients/patton.png' },
    { name: 'Sarita Handa', src: '/clients/sarita-handa.png' }
  ]

  const awards = [
    { name: 'Top US-Based IT Services Firm 2026', src: '/clients/us-based.webp' },
    { name: 'Clutch', src: '/clients/clutch.webp' },
    // { name: 'Ai Automation', src: '/strip/techreviewer.webp' },
    { name: 'Top eCommerce Development Company', src: '/clients/eCommerce_dev.webp' },
    { name: 'Good Firms', src: '/clients/good-firms.webp' },
    // { name: 'Top Machine Learning Companies - Goodfirms', src: '/clients/godfirms.webp' },
    { name: 'Partner', src: '/strip/strip1.svg' },
    { name: 'Partner', src: '/strip/yourstory.svg' },
    { name: 'Partner', src: '/strip/strip3.svg' },
    { name: 'Partner', src: '/strip/strip4.svg' },
    { name: 'Partner', src: '/strip/zbusiness.webp' },
    { name: 'Times of India', src: '/strip/toi.webp' },
    { name: 'PTI', src: '/strip/pti_logo.webp' },
    { name: 'Hindustan Times', src: '/strip/hindustan-times.webp' }
  ]

  return (
    <>
      {/* Vision & Mission Section with Background */}
      <section className='relative bg-black py-10 sm:py-14 md:py-[70px] overflow-hidden'>
        {/* Background Image with specific parallax styling */}
        

        <div className='relative z-[1] w-full mx-auto px-[2rem] md:px-[15px] min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px] min-[1400px]:max-w-[1320px]'>
          {/* Header */}
          <div className='text-center mb-8 sm:mb-10 md:mb-[60px]'>
            <h2 className='text-[22px] sm:text-[26px] md:text-[28px] font-semibold text-white font-figtree'>
              Our Vision & Mission
            </h2>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-8'>
            {/* Vision Card */}
            <m.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='bg-white backdrop-blur-[15px] p-5 sm:p-6 md:p-[30px] rounded-[12px] sm:rounded-[16px] border border-white/50 shadow-sm'
            >
              <h4 className='text-[20px] sm:text-[24px] font-semibold text-[#2A2B44] font-sans mb-4 sm:mb-5'>
                Our Vision
              </h4>
              <div className='font-sans'>
                <ul className='list-none m-0 py-2 sm:p-[10px_0] space-y-2'>
                  <li className='relative pl-[30px] sm:pl-[35px] text-[15px] sm:text-[16px] md:text-[18px] text-[#555] leading-[1.6]'>
                    <Image
                      src='/listtick.svg'
                      alt='Check'
                      width={22}
                      height={14}
                      className='absolute left-0 top-[4px] sm:top-[6px] w-5 h-3 sm:w-[22px] sm:h-[14px]'
                    />
                    To be recognized as a{' '}
                    <strong className='text-[#2A2B44] font-semibold'>
                      global leader in technology innovation,
                    </strong>{' '}
                    creating solutions that{' '}
                    <strong className='text-[#2A2B44] font-semibold'>
                      empower people, strengthen businesses, and inspire trust.
                    </strong>
                  </li>
                  <li className='relative pl-[30px] sm:pl-[35px] text-[15px] sm:text-[16px] md:text-[18px] text-[#555] leading-[1.6]'>
                    <Image
                      src='/listtick.svg'
                      alt='Check'
                      width={22}
                      height={14}
                      className='absolute left-0 top-[4px] sm:top-[6px] w-5 h-3 sm:w-[22px] sm:h-[14px]'
                    />
                    We envision a future where technology is seamlessly
                    integrated into daily life — helping businesses grow,
                    enabling individuals to achieve more, and ensuring
                    innovation remains
                    <strong className='text-[#2A2B44] font-semibold'>
                      {' '}
                      accessible to all.
                    </strong>
                  </li>
                  <li className='relative pl-[30px] sm:pl-[35px] text-[15px] sm:text-[16px] md:text-[18px] text-[#555] leading-[1.6]'>
                    <Image
                      src='/listtick.svg'
                      alt='Check'
                      width={22}
                      height={14}
                      className='absolute left-0 top-[4px] sm:top-[6px] w-5 h-3 sm:w-[22px] sm:h-[14px]'
                    />
                    Our vision is to make technology simpler, smarter, and more
                    human — for everyone.
                  </li>
                  
                </ul>
              </div>
            </m.div>

            {/* Mission Card */}
            <m.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='bg-white backdrop-blur-[15px] p-5 sm:p-6 md:p-[30px] rounded-[12px] sm:rounded-[16px] border border-white/50 shadow-sm'
            >
              <h4 className='text-[20px] sm:text-[24px] font-semibold text-[#2A2B44] font-sans mb-4 sm:mb-5'>
                Our Mission
              </h4>
              <div className='font-sans'>
                <ul className='list-none m-0 py-2 sm:p-[10px_0] space-y-2'>
                  <li className='relative pl-[30px] sm:pl-[35px] text-[15px] sm:text-[16px] md:text-[18px] text-[#555] leading-[1.6]'>
                    <Image
                      src='/listtick.svg'
                      alt='Check'
                      width={22}
                      height={14}
                      className='absolute left-0 top-[4px] sm:top-[6px] w-5 h-3 sm:w-[22px] sm:h-[14px]'
                    />
                    To develop{' '}
                    <strong className='text-[#2A2B44] font-semibold'>
                      human-centered, intelligent technologies
                    </strong>{' '}
                    that drive growth and create real-world impact.
                  </li>
                  <li className='relative pl-[30px] sm:pl-[35px] text-[15px] sm:text-[16px] md:text-[18px] text-[#555] leading-[1.6]'>
                    <Image
                      src='/listtick.svg'
                      alt='Check'
                      width={22}
                      height={14}
                      className='absolute left-0 top-[4px] sm:top-[6px] w-5 h-3 sm:w-[22px] sm:h-[14px]'
                    />
                    To{' '}
                    <strong className='text-[#2A2B44] font-semibold'>
                      make innovation affordable and accessible,
                    </strong>{' '}
                    helping startups and enterprises alike embrace the power of
                    digital transformation.
                  </li>
                  <li className='relative pl-[30px] sm:pl-[35px] text-[15px] sm:text-[16px] md:text-[18px] text-[#555] leading-[1.6]'>
                    <Image
                      src='/listtick.svg'
                      alt='Check'
                      width={22}
                      height={14}
                      className='absolute left-0 top-[4px] sm:top-[6px] w-5 h-3 sm:w-[22px] sm:h-[14px]'
                    />
                    To{' '}
                    <strong className='text-[#2A2B44] font-semibold'>
                      invest in research and emerging technologies
                    </strong>{' '}
                    that improve lives and redefine industries.
                  </li>
                  <li className='relative pl-[30px] sm:pl-[35px] text-[15px] sm:text-[16px] md:text-[18px] text-[#555] leading-[1.6]'>
                    <Image
                      src='/listtick.svg'
                      alt='Check'
                      width={22}
                      height={14}
                      className='absolute left-0 top-[4px] sm:top-[6px] w-5 h-3 sm:w-[22px] sm:h-[14px]'
                    />
                    To{' '}
                    <strong className='text-[#2A2B44] font-semibold'>
                      empower people through technology and opportunity,
                    </strong>{' '}
                    enabling sustainable growth and development.
                  </li>
                  <li className='relative pl-[30px] sm:pl-[35px] text-[15px] sm:text-[16px] md:text-[18px] text-[#555] leading-[1.6]'>
                    <Image
                      src='/listtick.svg'
                      alt='Check'
                      width={22}
                      height={14}
                      className='absolute left-0 top-[4px] sm:top-[6px] w-5 h-3 sm:w-[22px] sm:h-[14px]'
                    />
                    To{' '}
                    <strong className='text-[#2A2B44] font-semibold'>
                      deliver meaningful value
                    </strong>{' '}
                    through trust, quality, and innovation in everything we do.
                  </li>
                </ul>
              </div>
            </m.div>
          </div>

          {/* Highlight Section */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='mt-8 sm:mt-10 md:mt-12 text-center px-1'
          >
            <h5 className='font-satisfy text-[18px] sm:text-[22px] md:text-[24px] lg:text-[28px] text-white leading-relaxed'>
              At Akoode Technologies, our mission goes beyond delivering
              software —
              <span className='block mt-2'>
                We're here to shape the future, empower people, and make
                technology work for humanity.
              </span>
            </h5>
          </m.div>
        </div>
      </section>

      {/* Clients Section */}
      <section className='py-10 sm:py-14 md:py-[70px] bg-[#f8f9fa] overflow-hidden clients-section'>
        <div
          className='w-full mx-auto px-[2rem] md:px-[15px] min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px] min-[1400px]:max-w-[1320px]'
        >
          <div className='grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 sm:gap-8 md:gap-12 items-center'>
            {/* Left Column */}
            <m.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='clients-content text-left'
            >
              <h2
                className='text-[1.25rem] sm:text-[1.4rem] md:text-[1.5rem] 
            font-figtree font-semibold text-[#212529] 
            mb-3 sm:mb-[1.2rem] leading-tight'
              >
                Our Key Clients
              </h2>

              <p
                className='text-[0.9rem] sm:text-[1rem] text-[#555] 
            leading-[1.7] mb-6 sm:mb-8 md:mb-[2rem] font-figtree'
              >
                We provide high-quality technology solutions for businesses of
                all sizes — from new startups to growing companies.
              </p>
            </m.div>

            {/* Right Column */}
            <m.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='clients-logos w-full'
            >
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-0'>
                {clients.map((client, index) => (
                  <div
                    key={index}
                    className='bg-white p-4 border border-dashed border-black/10 flex items-center justify-center h-[90px] sm:h-[100px] transition-all duration-300 ease-in-out md:grayscale md:opacity-80 md:hover:grayscale-0 md:hover:opacity-100 md:hover:scale-105 rounded-[8px] sm:rounded-none'
                  >
                    <Image
                      src={client.src}
                      alt={client.name}
                      width={180}
                      height={100}
                      className='max-h-[55px] w-auto max-w-[140px] object-contain'
                    />
                  </div>
                ))}
              </div>
            </m.div>
          </div>
        </div>
      </section>
      {/* Awards Section */}
      <section className='py-10 sm:py-14 md:py-[70px] bg-[#2A2B44] overflow-hidden'>
        <div className='w-full mx-auto px-4 sm:px-6 md:px-[15px] min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px] min-[1400px]:max-w-[1320px]'>
          <div className='grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 sm:gap-10 lg:gap-12 items-center'>
            {/* Left Logos */}
            <m.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='space-y-6 sm:space-y-8 order-2 lg:order-1'
            >
              <div className='awards-logos space-y-[30px] sm:space-y-[38px]'>
                {/* Row 1: Badge logos — fixed equal-size boxes.
                    The visible space between badges came from the 1fr columns being
                    wider (198px) than the badges themselves (140px), not from `gap`.
                    Capping the row at 688px shrinks each column to ~163px, halving the
                    gap between badges (70px → 35px). Badge size and the mobile 2-up
                    layout are unchanged; the cap only applies from `sm` upward. */}
                <div className='grid grid-cols-2 sm:grid-cols-4 justify-items-center gap-4 sm:gap-3 sm:max-w-[688px] sm:mx-auto'>
                  {awards.slice(0, 4).map((award, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-center w-full max-w-[110px] aspect-square sm:max-w-[130px] md:max-w-[140px] rounded-[10px] border border-white/15 bg-white p-0.2 sm:p-0.5 transition-all duration-300 hover:scale-105'
                    >
                      <Image
                        src={award.src}
                        alt={award.name}
                        width={150}
                        height={150}
                        className='w-full h-full object-contain'
                      />
                    </div>
                  ))}
                </div>
                {/* Row 2: Media logos — flat horizontal */}
                <div className='flex flex-wrap items-center justify-center gap-5 sm:gap-7 md:gap-9'>
                  {awards.slice(4).map((award, index) => (
                    <div key={index} className='flex items-center justify-center'>
                      <Image
                        src={award.src}
                        alt={award.name}
                        width={140}
                        height={50}
                        className='h-5 sm:h-6 md:h-7 w-auto object-contain opacity-75 hover:opacity-100 transition-all duration-300 hover:scale-105'
                      />
                    </div>
                  ))}
                </div>
              </div>
            </m.div>

            {/* Right Content */}
            <m.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='text-white bg-[#2A2B44] order-1 lg:order-2 text-center lg:text-left'
            >
              <h2 className='text-[1.25rem] sm:text-[1.4rem] md:text-[1.5rem] font-bold font-figtree text-white mb-3 sm:mb-[1.2rem] leading-tight'>
                Awards & Recognitions
              </h2>
              <p className='text-[0.9rem] sm:text-[1rem] text-[#dcdcdc] leading-[1.7] mb-0 md:mb-[2rem] font-figtree'>
                We are proud to be recognized by prestigious organizations and
                leading media platforms for our innovative work, consistent
                delivery, and commitment to excellence.
              </p>
            </m.div>
          </div>
        </div>
      </section>
    </>
  )
}
