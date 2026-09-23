'use client';

import { useState } from 'react';
import Image from 'next/image';

/** Swaps to `fallbackSrc` on load error — resolveImageUrl can build a URL from a DB
 * field, but can't detect that the underlying upload was deleted (404 on the file itself). */
export default function BlogImage({ src, fallbackSrc, alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);
  const usingFallback = imgSrc === fallbackSrc;

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      // Skip the optimizer for the fallback itself — it's a known-good static asset,
      // and re-routing a failed request back through /_next/image only risks a second failure.
      unoptimized={usingFallback}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}
