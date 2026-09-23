import { Fragment } from "react";
import Link from "next/link";

/**
 * Dark-glass hero breadcrumb pill — the rounded outlined breadcrumb shown at the
 * top of the dark service/industry/country hero sections.
 *
 * @param {{ label: string, href?: string }[]} items  Ordered crumbs; the last one
 *        is rendered as the current page (no link). Items without a label are skipped.
 * @param {"left"|"center"} [align]  Horizontal alignment (default "left").
 * @param {string} [className]  Extra classes appended to the <nav>.
 */
export default function HeroBreadcrumb({ items = [], align = "left", className = "" }) {
  const crumbs = items.filter((c) => c && c.label);
  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`mb-5 max-w-full ${align === "center" ? "flex justify-center" : ""} ${className}`.trim()}
    >
      <ol
        className="inline-flex max-w-full min-w-0 items-center gap-1 sm:gap-1.5 overflow-hidden whitespace-nowrap rounded-full px-3 sm:px-3.5 py-1.5 font-figtree font-medium text-[11px] sm:text-[14px] leading-5"
        style={{ background: "rgba(255,255,255,0.05)", outline: "1px solid rgba(255,255,255,0.10)", outlineOffset: "-1px" }}
      >
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <Fragment key={i}>
              {i > 0 && (
                <li aria-hidden className="shrink-0" style={{ color: "#848B9E" }}>
                  &gt;
                </li>
              )}
              {isLast || !c.href ? (
                <li
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "min-w-0 flex-1 truncate text-white" : "shrink-0 text-white"}
                >
                  {c.label}
                </li>
              ) : (
                <li className="shrink-0">
                  <Link href={c.href} className="text-white transition-colors hover:text-[#B7BEED]">
                    {c.label}
                  </Link>
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
