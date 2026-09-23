"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

/* ------------------------------------------------------------------ *
 *  Inline search box for the case-studies listing page — filters the
 *  full set of active case studies (not just the section it's rendered
 *  in) client-side and drops a results panel under the input. Closes on
 *  outside click / Escape / result click.
 * ------------------------------------------------------------------ */
export default function CaseStudySearch({ items = [] }) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    useEffect(() => {
        const onPointerDown = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
        };
        const onKeyDown = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    const q = query.trim().toLowerCase();
    const results = q
        ? items
            .filter((item) =>
                [item.title, item.client, item.category].some((f) =>
                    (f || "").toLowerCase().includes(q)
                )
            )
            .slice(0, 8)
        : [];

    return (
        <div ref={rootRef} className="relative w-full sm:w-[260px] lg:w-[300px]">
            <div className="flex items-center gap-2 rounded-full border border-[#D7DCF2] bg-white px-4 py-2.5 transition-colors duration-300 focus-within:border-[#7683C5]">
                <Search className="h-4 w-4 shrink-0 text-[#9AA3C7]" strokeWidth={2} aria-hidden="true" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => query && setOpen(true)}
                    placeholder="Search case studies…"
                    aria-label="Search case studies"
                    className="w-full min-w-0 border-0 bg-transparent text-[13px] text-[#3D4665] outline-none placeholder:text-[#9AA3C7] sm:text-[14px]"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => {
                            setQuery("");
                            setOpen(false);
                        }}
                        aria-label="Clear search"
                        className="shrink-0 text-[#9AA3C7] transition-colors hover:text-[#5971fc]"
                    >
                        <X className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                )}
            </div>

            {open && q && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-20 max-h-[360px] w-full min-w-[280px] overflow-y-auto rounded-2xl border border-[#E7EAF4] bg-white p-2 shadow-[0_20px_50px_rgba(29,31,75,0.15)] sm:w-[340px]">
                    {results.length === 0 ? (
                        <p className="px-3 py-4 text-center text-[13px] text-[#6A7282]">
                            No case studies match "{query.trim()}"
                        </p>
                    ) : (
                        results.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 rounded-xl p-2 transition-colors duration-200 hover:bg-[#F4F5FA]"
                            >
                                {item.image && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={item.image}
                                        alt=""
                                        className="h-11 w-14 shrink-0 rounded-lg object-cover"
                                    />
                                )}
                                <span className="min-w-0">
                                    <span className="block truncate text-[13px] font-semibold leading-[1.3] text-[#191A2E]">
                                        {item.title}
                                    </span>
                                    {item.client && (
                                        <span className="block truncate text-[12px] leading-[1.4] text-[#6A7282]">
                                            {item.client}
                                        </span>
                                    )}
                                </span>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
