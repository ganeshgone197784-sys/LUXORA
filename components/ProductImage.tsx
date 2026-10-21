'use client';
import { useEffect, useRef, useState } from 'react';

// Shows an elegant placeholder instead of a broken image icon.
export default function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [bad, setBad] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setBad(true); // failed before hydration
  }, []);
  if (bad) return <div className="fb">{alt.charAt(0)}</div>;
  return <img ref={ref} loading="lazy" alt={alt} src={src} onError={() => setBad(true)} />;
}
