// Decorative line-art exported from Figma nodes 1017:2051 / 2052 / 2053, plus
// the blurred glow ellipse at 1017:2102.
//
// This lives on the wrapper that holds BOTH the hero and the trust bar rather
// than inside the hero section itself. The source frame (1017:2050) is a single
// 1901 x 896 artboard covering header + hero + stats bar, so the percentages
// below are relative to that whole block — scoping them to the hero alone
// clipped the swirls at the CTA row and left the stats bar on flat colour.
//
// No hooks here, so it stays a server component alongside the template.
const DECOR = [
  { src: "/staff_augmentation/hero-vector-1.svg", left: "-0.02%", top: "-19.02%", width: "33.43%", height: "77.81%", opacity: 0.75 },
  { src: "/staff_augmentation/hero-vector-2.svg", left: "18.66%", top: "47.52%", width: "46.07%", height: "79.70%", opacity: 0.75 },
  { src: "/staff_augmentation/hero-group.svg", left: "-7.47%", top: "-22.43%", width: "70.62%", height: "162.54%", opacity: 0.9 },
];

export default function StaffAugHeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Soft dark glow behind the headline (Figma 1017:2102) */}
      <div
        className="absolute left-1/2 hidden -translate-x-1/2 sm:block"
        style={{ top: "12%", width: "65.4%", height: "73%", zIndex: 1 }}
      >
        <img src="/staff_augmentation/hero-ellipse.svg" alt="" className="h-full w-full" />
      </div>

      {DECOR.map(({ src, left, top, width, height, opacity }) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute hidden select-none lg:block"
          style={{ left, top, width, height, opacity, zIndex: 2 }}
        />
      ))}
    </div>
  );
}
