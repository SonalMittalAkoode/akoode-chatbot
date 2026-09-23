"use client";

import { useRef, useState } from "react";

export function Magnetic({ children, strength = 0.35 }) {
  const divRef = useRef(null);
  const [t, setT] = useState({ x: 0, y: 0, s: 1 });

  return (
    <div
      ref={divRef}
      onMouseMove={(e) => {
        if (!divRef.current) return;
        const r = divRef.current.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        setT({ x, y, s: 1.04 });
      }}
      onMouseLeave={() => setT({ x: 0, y: 0, s: 1 })}
      className="inline-block"
      style={{
        transform: `translate(${t.x}px, ${t.y}px) scale(${t.s})`,
        transition: "transform .4s cubic-bezier(.2,1.2,.3,1)",
      }}
    >
      {children}
    </div>
  );
}
