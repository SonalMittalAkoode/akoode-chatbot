'use client'

import RichText from '../RichText'


const ACCENT = '#6679e4'
const INK = '#1d1f4b'
const RULE = '#d8daf0'

const StackIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 17L12 22L22 17" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12L12 17L22 12" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="none" aria-hidden>
    <path d="M6.66667 15H23.3333M15.8333 8.33333L22.5 15L15.8333 21.6667" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* The queued cards peeking above this one. */
function PeekBars() {
  return (
    <div className="shrink-0 px-5 pt-[14px]">
      <div className="flex flex-col gap-px">
        <div className="h-[3.5px] w-full rounded-full" style={{ background: ACCENT }} />
        <div className="pt-[5px]">
          <div className="h-[2px] w-full rounded-full" style={{ background: ACCENT, opacity: 0.55 }} />
        </div>
        <div className="pt-[4px]">
          <div className="h-[1.5px] w-full rounded-full" style={{ background: ACCENT, opacity: 0.3 }} />
        </div>
      </div>
    </div>
  )
}

function TechStackRow({ tags }) {
  if (!tags?.length) return null
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-white"
        style={{ border: `0.8px solid ${RULE}` }}
      >
        <StackIcon />
      </span>
      <span className="text-[17px] font-bold" style={{ color: ACCENT }}>Tech Stack:</span>
      <span className="text-[17px]" style={{ color: INK }}>{tags.join(', ')}</span>
    </div>
  )
}

function ExploreLink({ href, label }) {
  return (
    <a href={href} className="group inline-flex items-center gap-2.5" style={{ textDecoration: 'none' }}>
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1"
        style={{ border: `0.8px solid ${ACCENT}` }}
      >
        <ArrowIcon />
      </span>
      <span className="text-[17px] font-semibold" style={{ color: ACCENT }}>{label}</span>
    </a>
  )
}

function Bullets({ points, className = "text-[18px]" }) {
  if (!points?.length) return null
  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {points.map((pt, i) => (
        <li key={`${pt}-${i}`} className={`flex items-start gap-3 leading-[1.6] ${className}`} style={{ color: INK }}>
          <span className="mt-[9px] size-[6px] shrink-0 rounded-full" style={{ background: ACCENT }} />
          <span>{pt}</span>
        </li>
      ))}
    </ul>
  )
}

export function MadServiceCardDesktop({ service, scale = 1 }) {
  const s = service
  return (
    <article
      className="flex flex-col overflow-hidden rounded-[24px] bg-white pt-[3px] h-full"
      style={{
        transform: scale < 1 ? `scale(${scale}) translateZ(0)` : 'translateZ(0)',
        transformOrigin: 'top center',
        height: '100%',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
        WebkitFontSmoothing: 'antialiased',
        willChange: 'transform'
      }}
    >
      <PeekBars />
      <div className="flex flex-1 min-h-0" style={{ borderTop: '1px solid #e8ebfb' }}>
        <div className="shrink-0 pt-8 pl-[42px] pr-[24px]">
          <span
            className="block leading-none"
            style={{ color: ACCENT, fontSize: 36, fontWeight: 400, letterSpacing: '-0.03em' }}
          >
            {s.n}
          </span>
        </div>

        <div className="w-px shrink-0 self-stretch" style={{ background: RULE }} aria-hidden />

        <div className="flex min-w-0 flex-1 flex-col py-8 pl-[36px] pr-[44px]">
          <div>
            <h3
              className="m-0"
              style={{ color: INK, fontSize: 18, fontWeight: 800, lineHeight: 1.18, letterSpacing: '-0.035em', textShadow: 'none' }}
            >
              {s.t}
            </h3>
            <div className="mt-[17px] h-[2px] w-full" style={{ background: INK, opacity: 0.12 }} />
          </div>

          <div className="flex-1">
            <RichText
              className="mt-[17px] block text-[16px] leading-[1.65] [&_p]:!text-inherit [&_p]:!text-[16px] [&_p]:!leading-relaxed"
              style={{ color: INK }}
              html={s.para}
            />
            <div className="mt-5">
              <Bullets points={s.points} className="text-[16px]" />
            </div>
          </div>

          <div>
            {s.tags?.length > 0 && (
              <>
                <div className="mt-[23px] h-px w-full" style={{ background: RULE }} />
                <div className="mt-[23px]">
                  <TechStackRow tags={s.tags} />
                </div>
              </>
            )}
            <div className="mt-5 h-px w-full" style={{ background: RULE }} />
            <div className="mt-5">
              <ExploreLink href={s.ctaLink} label={s.ctaText} />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export function MadServiceCardMobile({ service }) {
  const s = service
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] bg-white pt-[3px]">
      <PeekBars />
      <div className="flex min-h-0 flex-1 flex-col p-5" style={{ borderTop: '1px solid #e8ebfb' }}>
        <div className="flex shrink-0 items-baseline gap-3">
          <span
            className="leading-none"
            style={{ color: ACCENT, fontSize: 24, fontWeight: 400, letterSpacing: '-0.03em' }}
          >
            {s.n}
          </span>
          <h3
            className="m-0"
            style={{ color: INK, fontSize: 16, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.035em', textShadow: 'none' }}
          >
            {s.t}
          </h3>
        </div>

        <div className="mt-3 h-[2px] w-full shrink-0" style={{ background: '#0f1228', opacity: 0.12 }} />

        <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-1">
          <RichText className="block text-[14px] leading-[1.6] [&_p]:!text-inherit [&_p]:!text-[14px] [&_p]:!leading-relaxed" style={{ color: INK }} html={s.para} />

          <div className="mt-4">
            <Bullets points={s.points} className="text-[14px]" />
          </div>

          {s.tags?.length > 0 && (
            <>
              <div className="mt-4 h-px w-full" style={{ background: RULE }} />
              <div className="mt-4">
                <TechStackRow tags={s.tags} />
              </div>
            </>
          )}
        </div>

        <div className="mt-4 h-px w-full shrink-0" style={{ background: RULE }} />
        <div className="mt-4 shrink-0">
          <ExploreLink href={s.ctaLink} label={s.ctaText} />
        </div>
      </div>
    </article>
  )
}
