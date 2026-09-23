"use client";

import { Star, Users, Briefcase, Rocket } from "lucide-react";

const ICONS = { Star, Users, Briefcase, Rocket };

const STATS = [
  { value: "4.9", label: "Google Rating", icon: "Star" },
  { value: "97%", label: "Client Retention", icon: "Users" },
  { value: "180+", label: "Projects Delivered", icon: "Briefcase" },
  { value: "15+", label: "Industries Served", icon: "Rocket" },
];

// `stats` is overridable so other templates can reuse this bar with their own
// figures (the staff-augmentation hero, for example, counts Clients Served
// rather than Projects Delivered). Omitting it keeps the web-dev defaults.
//
// Items carry `icon` as a NAME, not a component: this is a client component, so
// a server-rendered template passing real lucide components as props would trip
// React's "Functions cannot be passed directly to Client Components" guard.
export default function WebDevelopmentTrustBarSection({ stats = STATS } = {}) {
  return (
    <section className="relative overflow-hidden py-6 sm:py-8">

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 sm:overflow-x-auto sm:px-8 lg:px-16">

        <div
          className="grid grid-cols-2 gap-x-6 gap-y-6 rounded-[24px] border px-6 py-6 w-fit mx-auto sm:flex sm:flex-nowrap sm:items-center sm:justify-center sm:gap-x-[48px] sm:rounded-[32px] sm:px-8 sm:py-5 lg:gap-x-[80px]"
          style={{ background: "rgba(29,32,51,0.6)", borderColor: "rgba(29,32,51,0.3)" }}
        >
          {stats.map(({ value, label, icon }, i) => {
            const Icon = ICONS[icon] || Star;
            return (
            <div key={label || i} className="flex min-w-0 items-center gap-2 sm:shrink-0 sm:gap-3.5">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border-[0.8px] sm:size-11 sm:rounded-xl"
                style={{ background: "#1D1F4B", borderColor: "#7186FA" }}
              >
                <Icon className="size-4 sm:size-5" strokeWidth={1.5} style={{ color: "#7186FA" }} />
              </span>
              <div className="min-w-0">
                <p
                  className="font-figtree text-[16px] font-bold leading-[1.15] text-white sm:text-[22px]"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {value}
                </p>
                <p className="font-figtree text-[12px] leading-[1.2] font-normal text-white/70 sm:whitespace-nowrap sm:text-[13px]">
                  {label}
                </p>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
