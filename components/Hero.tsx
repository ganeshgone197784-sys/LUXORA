'use client';
import { useEffect, useState } from 'react';
import { asset } from '@/lib/asset';
import { unsplash } from '@/lib/products';
import { useStore } from './StoreProvider';

interface Slide { eyebrow: string; img: string | null }
const SLIDES: Slide[] = [
  { eyebrow: 'PREMIUM FASHION COLLECTION', img: null }, // uses /hero.webp from CSS
  { eyebrow: "MEN'S COLLECTION", img: unsplash('1507679799987-c73779587ccf', 1400) },
  { eyebrow: "WOMEN'S COLLECTION", img: unsplash('1469334031218-e382a71b716b', 1400) },
];

export default function Hero() {
  const { showFilter } = useStore();
  const [live, setLive] = useState<Slide[]>([SLIDES[0]]);
  const [i, setI] = useState(0);

  // Extra slides only appear if their image actually loads.
  useEffect(() => {
    let alive = true;
    SLIDES.slice(1).forEach((s) => {
      const im = new Image();
      im.onload = () => {
        if (alive) setLive((prev) => (prev.includes(s) ? prev : [...prev, s].sort((a, b) => SLIDES.indexOf(a) - SLIDES.indexOf(b))));
      };
      im.src = s.img as string;
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (live.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setI((n) => (n + 1) % live.length), 6000);
    return () => clearTimeout(t);
  }, [i, live.length]);

  const idx = i % live.length;
  const s = live[idx];
  const go = (n: number) => setI((n + live.length) % live.length);

  return (
    <div className="hero" id="hero" style={{ backgroundImage: `url('${s.img ?? asset('/hero.webp')}')` }}>
      <div className="wrap">
        <div className="eyebrow">{s.eyebrow}</div>
        <h1>ELEGANCE<br />BEYOND ORDINARY</h1>
        <p>Discover your signature style.</p>
        <a className="btn p" href="#shop" onClick={() => showFilter('Men')}>SHOP MEN &nbsp;→</a>
        <a className="btn" href="#shop" onClick={() => showFilter('Women')}>SHOP WOMEN &nbsp;→</a>
        <div className="dots">
          {live.map((_, k) => <i key={k} className={k === idx ? 'on' : ''} onClick={() => go(k)} />)}
        </div>
      </div>
      <span className="arr" style={{ left: 4 }} onClick={() => go(idx - 1)}>‹</span>
      <span className="arr" style={{ right: 4 }} onClick={() => go(idx + 1)}>›</span>
    </div>
  );
}
