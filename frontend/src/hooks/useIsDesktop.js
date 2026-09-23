"use client";

import { useSyncExternalStore } from "react";

// Several sections on this site have two genuinely different layouts rather
// than one responsive layout — a scattered canvas vs a stack, a sidebar + card
// vs an accordion. Rendering both and hiding one with `hidden lg:block` ships
// every string twice in the HTML, which is wasted payload and gives crawlers
// the same copy twice.
//
// This returns false on the server and during the first client render, so the
// SSR output contains the mobile layout only — one copy of the content, which
// is also what mobile-first indexing looks at — then flips to true in the same
// commit as hydration on a desktop viewport.
//
// useSyncExternalStore rather than useState + useEffect: the server snapshot is
// explicit, so React does not warn about a hydration mismatch and the swap
// happens without an extra render pass.
const QUERY = "(min-width: 1024px)";

const subscribe = (onChange) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

export default function useIsDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
