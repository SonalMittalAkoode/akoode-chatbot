'use client'

import { useEffect, useRef, useState } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { splitTitle } from './shared'
import RichText from './RichText'
import { MadServiceCardDesktop, MadServiceCardMobile } from './mad/MadServiceCard'

const DEFAULT_SERVICES = [
    {
      n: '01',
      t: 'Web Platforms',
      sub: 'Performance-first web products\nbuilt to rank, convert and scale.',
      para: 'We build Next.js platforms that score green on Core Web Vitals out of the box — not after a last-minute sprint. Headless CMS, typed APIs, incremental static regeneration and real-user monitoring from day one. Your marketing team ships content without a ticket; your engineers extend a typed component library without touching production.',
      points: [
        'Sub-1s LCP on cold loads, P75 on real user data',
        'Headless CMS — Sanity, Contentful or Strapi',
        'Multi-region edge deployment via Vercel or Cloudflare Workers',
        'Accessible design-system component library in Storybook',
        'A/B testing and conversion analytics on every page'
      ],
      tags: [
        'Next.js 14',
        'Edge Runtime',
        'Headless CMS',
        'Core Web Vitals',
        'TypeScript'
      ]
    },
    {
      n: '02',
      t: 'Mobile Applications',
      sub: 'Native feel, cross-platform\nspeed — shipped on a two-week train.',
      para: 'React Native and Flutter apps that pass for native — 60 fps animations via Reanimated 3, offline-first sync designed into the data layer before a screen is coded, and OTA hot-patches that ship a fix in under 10 minutes. Every sprint ends with a TestFlight build your stakeholders can tap through.',
      points: [
        '60 fps animations with Reanimated 3 / Flutter Impeller',
        'Offline-first sync with conflict resolution via WatermelonDB',
        'OTA updates via Expo EAS — no App Store review delay',
        'Native module bridging for BLE, NFC, camera and biometrics',
        'Automated E2E coverage with Detox on physical devices'
      ],
      tags: [
        'React Native',
        'Flutter',
        'Expo EAS',
        'Offline-first',
        'Reanimated'
      ]
    },
    {
      n: '03',
      t: 'AI & Machine Learning',
      sub: 'Intelligence integrated where\nit creates measurable value.',
      para: "RAG pipelines with citation-accurate retrieval, autonomous agents that act inside your existing systems, and fine-tuned models that speak your domain's language. Every model ships with an evaluation harness — metrics defined, test suite built, regression baseline locked — so you know exactly what you're getting before it reaches production.",
      points: [
        'RAG with hybrid dense + sparse retrieval and re-ranking',
        'LLM agents with tool use, memory and safety guardrails',
        'Fine-tuning and RLHF on proprietary domain datasets',
        'Computer vision pipelines for detection, classification, OCR',
        'Streaming inference APIs at sub-100ms P95 latency'
      ],
      tags: ['RAG', 'LLM Agents', 'Fine-tuning', 'Pinecone', 'LangGraph']
    },
    {
      n: '04',
      t: 'Cloud & DevOps',
      sub: 'Infrastructure that runs\nwhile your team sleeps.',
      para: 'AWS and GCP architectures that are observable by default and auditable from day one. Every resource is versioned in Terraform, reviewable in a PR, and reproducible in a fresh account in under an hour. SLOs are defined before a single file is written — error budgets drive releases, not gut feel.',
      points: [
        'Multi-account AWS Landing Zone with Control Tower and SCPs',
        'GitOps delivery via ArgoCD with sub-2-minute rollback',
        'Full observability: OTel traces, Prometheus metrics, JSON logs',
        '30–40% cloud cost reduction typical in the first quarter',
        'SOC 2 Type II and ISO 27001 compliant baseline from day one'
      ],
      tags: ['AWS', 'Terraform', 'ArgoCD', 'OpenTelemetry', 'SRE']
    },
    {
      n: '05',
      t: 'Data Engineering',
      sub: 'One source of truth every\nteam actually trusts.',
      para: 'Modern data stacks where every team queries the same numbers — well-modelled warehouse, dbt transformations with end-to-end lineage, and reverse-ETL that keeps your CRM and warehouse in agreement. Every pipeline ships with freshness monitors and anomaly alerts wired to Slack before your dashboards go live.',
      points: [
        'Snowflake, BigQuery or Redshift with medallion architecture',
        'dbt project with full lineage, column-level tests and auto-docs',
        'ELT orchestration via Airflow or Dagster with SLA alerting',
        'Reverse-ETL into Salesforce, HubSpot and custom targets',
        'Real-time streaming with Kafka or Kinesis where needed'
      ],
      tags: ['Snowflake', 'dbt', 'Airflow', 'Kafka', 'Great Expectations']
    }
]

// A CTA link saved in the CMS without a leading slash
// ("services/mvp-development-for-startups") is a RELATIVE href: on
// /uk/edinburgh/mobile-app-development the browser resolves it to
// /uk/edinburgh/services/mvp-... , which 404s. Anything that is not already an
// absolute URL, a protocol link (mailto:/tel:), an anchor or a query is rooted.
const absolutePath = (href) => {
  const value = String(href || "").trim();
  if (!value) return "";
  if (/^([a-z][a-z0-9+.-]*:|\/\/|[/#?])/i.test(value)) return value;
  return `/${value}`;
};

export function ServicesWeOffer({ data, variant = 'default' }) {
  const isMad = variant === 'mad'
  const heading = data?.heading || "Five disciplines, one team under one roof.";
  const intro = data?.intro || "Scroll through each service, one at a time.";
  const rawServices = data?.services?.length
    ? data.services.filter(s => (s.title || s.t || '').trim() || (s.para || '').trim())
    : []
  const services = rawServices.length
    ? rawServices.map((s, i) => ({
        n: s.n || String(i + 1).padStart(2, '0'),
        t: s.title || s.t || '',
        sub: s.subtitle || s.sub || '',
        para: s.para || '',
        points: Array.isArray(s.points) ? s.points : [],
        tags: Array.isArray(s.tags) ? s.tags : [],
        ctaText: s.ctaText || "Start your project",
        ctaLink: absolutePath(s.ctaLink) || "/post-requirement",
      }))
    : DEFAULT_SERVICES



  const N = services.length
  const DWELL = 800

  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const wrapRef = useRef(null)
  const cardRefs = useRef([])
  const wrapAbsTop = useRef(0)
  const mobileTrackRef = useRef(null)
  const mobilePausedRef = useRef(false)
  const mobilePauseTimerRef = useRef(null)

  const [wrapH, setWrapH] = useState((N - 1) * DWELL + 1600)

  const [madCardH, setMadCardH] = useState(0)
  const [madScale, setMadScale] = useState(1)
  const [madMaxH, setMadMaxH] = useState(0)

  useEffect(() => {
    if (!isDesktop || !isMad) return
    const measure = () => {
      let max = 0
      cardRefs.current.forEach(c => {
        const el = c?.firstElementChild
        if (el) max = Math.max(max, el.scrollHeight)
      })
      if (!max) return
      setMadMaxH(max)
      const avail = window.innerHeight - 170
      const k = max > avail ? avail / max : 1
      setMadScale(k)
      setMadCardH(max * k)
    }
    measure()
    const ro = new ResizeObserver(measure)
    cardRefs.current.forEach(c => c?.firstElementChild && ro.observe(c.firstElementChild))
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [isDesktop, isMad, services])

  useEffect(() => {

    if (!isDesktop) return

    let raf = 0

    const computeWrapH = () => {
      const vh = window.innerHeight

      const stickyH = isMad && madCardH
        ? madCardH
        : (window.innerWidth < 1280 ? vh * 0.9 : vh * 0.8)
      const STICKY_TOP = 80 
      const tail = isMad ? 150 : 120

      setWrapH((N - 1) * DWELL + stickyH + tail)
    }

    const measureWrap = () => {
      if (wrapRef.current) {
        wrapAbsTop.current =
          wrapRef.current.getBoundingClientRect().top + window.scrollY
      }
    }

    const tick = () => {
      const scrolled = Math.max(0, window.scrollY - wrapAbsTop.current)
      const prog = scrolled / DWELL

      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const d = prog - i
        let ty = 0
        let pixelY = 0
        let sc = 1

        if (d <= 0) {
          ty = Math.min(100, -d * 100)
          pixelY = 0
          sc = 1
        } else {
          ty = 0
          if (i === N - 1) {
            pixelY = 0
            sc = 1
          } else {
            pixelY = d * -15
            sc = Math.max(0.93, 1 - d * 0.035)
          }
        }

        card.style.transform = `translateY(calc(${ty}% + ${pixelY}px)) scale(${sc})`
        card.style.opacity = '1'
      })
    }

    computeWrapH()
    measureWrap()
    tick()

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }
    const onResize = () => {
      computeWrapH()
      measureWrap()
      tick()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [isDesktop, isMad, madCardH])

  useEffect(() => {
    if (isDesktop) return
    const el = mobileTrackRef.current
    if (!el) return
    const id = setInterval(() => {
      if (mobilePausedRef.current) return
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
      if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' })
      else el.scrollBy({ left: el.clientWidth * 0.82, behavior: 'smooth' })
    }, 3500)
    return () => { clearInterval(id); clearTimeout(mobilePauseTimerRef.current) }
  }, [isDesktop])

  const pauseMobileBriefly = () => {
    mobilePausedRef.current = true
    clearTimeout(mobilePauseTimerRef.current)
    mobilePauseTimerRef.current = setTimeout(() => { mobilePausedRef.current = false }, 2000)
  }

  return (
    <section className={`sbc-section pb-0 ${isMad ? 'sbc-section--dark sbc-section--flat' : 'sbc-section--light'}`} style={{ paddingTop: 50 }}>
      {!isMad && <div className='sbc-glow-blob sbc-light-blob--tl' aria-hidden='true' />}
      {!isMad && <div className='sbc-glow-blob sbc-light-blob--br' aria-hidden='true' />}
      <div className='sbc-container'>
        <div className='reveal sbc-section-head sbc-section-head--single-title mb-[60px]'>
          <h2 className={`sbc-h2 sbc-section-title font-bold transition-colors duration-400 mb-0 ${isMad ? 'text-white' : 'text-[#1a1a1a]'}`}>
            {(() => {
              const { main, accent, suffix } = splitTitle(heading);
              return (
                <>
                  {main} {accent && <span className="sbc-heading-accent">{accent}</span>} {suffix}
                </>
              );
            })()}
          </h2>
          <RichText className={`sbc-body-lg sbc-section-subtitle !max-w-[720px] ${isMad ? 'text-[rgba(245,244,255,0.96)]' : 'text-[#2a2d52]'}`} html={intro} />
        </div>
      </div>

      {isDesktop && (
      <div ref={wrapRef} style={{ height: wrapH }}>
        <div
          className={`sticky top-20 ${isMad ? '' : 'h-[90vh] xl:h-[80vh]'}`}
          style={isMad && madCardH ? { height: madCardH } : undefined}
        >
          <div
            className={`relative rounded-3xl ${isMad ? 'mx-auto h-full w-[97%] max-w-[1680px] overflow-visible' : 'sbc-container h-full overflow-visible xl:overflow-hidden'}`}
            style={isMad ? { clipPath: 'polygon(-20% -120px, 120% -120px, 120% 100%, -20% 100%)' } : undefined}
          >
            {services.map((s, i) => (
              <div
                key={`${s.n}-${i}`}
                ref={el => {
                  cardRefs.current[i] = el
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  transformOrigin: 'top center',
                  height: isMad && madMaxH ? madMaxH : undefined,
                  ...(isMad ? null : { bottom: 0 }),
                  transform: i === 0 ? 'translateY(0%)' : 'translateY(100%)',
                  opacity: 1,
                  zIndex: i + 1,
                  willChange: 'transform, opacity'
                }}
              >
                {isMad ? <MadServiceCardDesktop service={s} scale={madScale} /> : (
                <article
                  className='h-full rounded-3xl overflow-hidden flex flex-col'
                  style={{
                    background:
                      'radial-gradient(ellipse 70% 90% at 25% 60%, #32345a 0%, #252848 100%)',
                    border: '1px solid rgba(180,170,255,0.18)',
                    boxShadow:
                      '0 24px 80px -16px rgba(10,8,40,0.65), 0 4px 16px rgba(10,8,40,0.4), inset 0 1px 0 rgba(220,210,255,0.18)'
                  }}
                >
                  <div className='flex items-center justify-between px-12 py-[18px] shrink-0 bg-[rgba(0,0,0,0.12)] border-b border-[rgba(180,170,255,0.10)]'>
                    <div className='flex items-center gap-3.5'>
                      <span
                        className='text-[11px] tracking-[0.22em] uppercase text-white/95'
                        style={{
                          fontFamily:
                            'var(--font-geist-mono), ui-monospace, monospace'
                        }}
                      >
                        {s.n} / 0{N}
                      </span>
                      <span className='w-px h-3.5 bg-[rgba(210,200,255,0.35)] shrink-0' />
                      <span
                        className='text-[15px] font-semibold text-white tracking-[-0.01em]'
                        style={{
                          fontFamily:
                            'var(--font-figtree), system-ui, sans-serif'
                        }}
                      >
                        {s.t}
                      </span>
                    </div>
                    <div className='flex items-center gap-[5px]'>
                      {services.map((_, j) => (
                        <div
                          key={j}
                          style={{
                            width: j === i ? 18 : 6,
                            height: 6,
                            borderRadius: 999,
                            background:
                              j <= i
                                ? 'rgba(200,190,255,0.8)'
                                : 'rgba(200,190,255,0.18)'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div
                    className='flex-1 grid overflow-hidden'
                    style={{ gridTemplateColumns: '1fr 1.6fr' }}
                  >
                    <div className='pt-8 xl:pt-9 pr-8 xl:pr-10 pb-8 xl:pb-9 pl-8 xl:pl-12 flex flex-col justify-between overflow-hidden border-r border-[rgba(180,170,255,0.15)]'>
                      <div>
                        <div
                          className='text-[11px] tracking-[0.2em] uppercase mb-5'
                          style={{
                            fontFamily:
                              'var(--font-geist-mono), ui-monospace, monospace',
                            color: 'rgba(210,200,255,1)'
                          }}
                        >
                          Service {s.n}
                        </div>
                        <h3 className='sbc-h3 text-white font-bold whitespace-pre-line'>
                          {s.sub}
                        </h3>
                      </div>
                      <a
                        href={s.ctaLink}
                        className='sbc-btn sbc-btn--primary group h-[56px] w-fit px-7 text-[15px] flex items-center gap-2'
                        style={{ textDecoration: 'none' }}
                      >
                        {s.ctaText}
                        <FiArrowRight
                          size={16}
                          strokeWidth={1.5}
                          className='transition-transform duration-300 group-hover:translate-x-1'
                        />
                      </a>
                      <div className='flex flex-wrap gap-1.5'>
                        {s.tags.map((tag, ti) => (
                          <span
                            key={`${tag}-${ti}`}
                            className='px-2.5 py-[5px] rounded-full bg-[rgba(180,165,255,0.18)] border border-[rgba(200,185,255,0.4)] text-[11px] tracking-[0.05em]'
                            style={{
                              color: 'rgba(225,215,255,1)',
                              fontFamily:
                                'var(--font-geist-mono), ui-monospace, monospace'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className='pt-8 xl:pt-9 pr-8 xl:pr-12 pb-8 xl:pb-9 pl-8 xl:pl-10 overflow-y-auto min-h-0'>
                      <RichText className='sbc-body !text-[rgba(245,244,255,0.97)] leading-[1.78] mb-5' html={s.para} />
                      <ul className='mt-5 flex flex-col gap-2.5 list-none p-0'>
                        {s.points.map((pt, pi) => (
                          <li
                            key={`${pt}-${pi}`}
                            className='flex items-start gap-2.5 text-[14px] leading-[1.5]'
                            style={{ color: '#ffffff' }}
                          >
                            <span
                              className='w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-px'
                              style={{
                                background: 'rgba(255,255,255,0.12)',
                                border: '1px solid rgba(255,255,255,0.28)'
                              }}
                            >
                              <svg
                                width='8'
                                height='6'
                                viewBox='0 0 8 6'
                                fill='none'
                              >
                                <path
                                  d='M1 3l2 2 4-4'
                                  stroke='#fff'
                                  strokeWidth='1.5'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                              </svg>
                            </span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {!isDesktop && (
      <div>
        <div ref={mobileTrackRef} onTouchStart={pauseMobileBriefly} onMouseEnter={() => { mobilePausedRef.current = true }} onMouseLeave={() => { mobilePausedRef.current = false }} className='sbc-container flex gap-4 overflow-x-auto snap-x snap-mandatory pb-5 sbc-scroll-hide'>
          {services.map((s, i) => (
            isMad ? (
              <div key={`${s.n}-${i}`} className='rounded-[20px] flex-shrink-0 w-[80vw] max-w-[360px] h-[82vh] min-h-[560px] max-h-[720px] sm:h-[640px] snap-center'>
                <MadServiceCardMobile service={s} />
              </div>
            ) : (
            <article
              key={`${s.n}-${i}`}
              className='rounded-2xl flex-shrink-0 w-[80vw] max-w-[360px] h-[82vh] min-h-[560px] max-h-[720px] sm:h-[640px] snap-center flex flex-col relative isolate'
              style={{
                background: '#252848',
                border: '1px solid rgba(180,170,255,0.18)',
                boxShadow: '0 10px 28px -14px rgba(10,8,40,0.45)'
              }}
            >
              {/* header */}
              <div className='flex items-center gap-2.5 sm:gap-3 px-4 py-3.5 sm:px-5 sm:py-4 shrink-0 border-b border-white/10'>
                <span className='text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-white/90'>
                  {s.n} / 0{N}
                </span>

                <span className='w-px h-3 bg-white/20' />

                <span className='text-[13px] sm:text-[14px] font-semibold text-white'>
                  {s.t}
                </span>
              </div>

              <div className='flex flex-col flex-1 p-4 sm:p-5 min-h-0'>
                <div className='text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-2.5 sm:mb-3 text-white/70 shrink-0'>
                  Service {s.n}
                </div>

                <h3 className='sbc-h3 text-white whitespace-pre-line mb-2.5 sm:mb-3 text-[18px] sm:text-xl shrink-0'>
                  {s.sub}
                </h3>

                <div className='flex-1 overflow-y-auto pr-1 min-h-0'>
                  <RichText
                    className='text-[12.5px] sm:text-[13px] leading-[1.6] !text-white mb-3 sm:mb-4 relative z-20'
                    style={{
                      WebkitFontSmoothing: 'antialiased',
                      lineHeight: '1.55'
                    }}
                    html={s.para}
                  />

                  <ul className='flex flex-col gap-2 mb-4'>
                    {s.points.map((pt, pi) => (
                      <li
                        key={`${pt}-${pi}`}
                        className='flex gap-2 text-[11.5px] sm:text-[12px] leading-[1.45] text-white'
                      >
                        <span className='w-4 h-4 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-px'>
                          ✓
                        </span>

                        {pt}
                      </li>
                    ))}
                  </ul>

                  <div className='flex flex-wrap gap-1.5'>
                    {s.tags.map((tag, ti) => (
                      <span
                        key={`${tag}-${ti}`}
                        className='px-2 py-1 rounded-full text-[10px] text-white/90 border border-white/20'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={s.ctaLink}
                  className='sbc-btn sbc-btn--primary w-full min-h-[44px] sm:min-h-[48px] py-2.5 px-3 mt-3 sm:mt-4 shrink-0 flex items-center justify-center gap-1.5 sm:gap-2 text-center leading-snug text-[12.5px] sm:text-[15px]'
                  style={{ textDecoration: 'none' }}
                >
                  <span className='min-w-0'>{s.ctaText}</span>
                  <FiArrowRight size={15} className='shrink-0' />
                </a>
              </div>
            </article>
            )
          ))}
        </div>
      </div>
      )}
    </section>
  )
}
