"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Button({
  text,
  className = "",
  href,
  variant = "default",
  ...props
}) {
  const variants = {
    default: "bg-[linear-gradient(90deg,#474972_0%,#585c9c_100%)] hover:bg-[linear-gradient(90deg,#585c9c_0%,#474972_100%)]",
    black: "bg-[#1a1b2e] hover:bg-[linear-gradient(90deg,#585c9c_0%,#474972_100%)]",
  };

  const baseClasses = "group inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-white font-semibold text-md hover:cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl";
  const variantClasses = variants[variant] || variants.default;
  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`.trim().replace(/\s+/g, ' ');

  const iconClasses = "text-xl rotate-[-45deg] transition-transform duration-300 ease-in-out group-hover:rotate-0 group-hover:translate-x-2";

  const content = (
    <>
      <span>{text}</span>
      <ArrowRight className={iconClasses} size={20} />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {content}
    </button>
  );
}
