'use client';
import { asset } from '@/lib/asset';
import { useStore } from './StoreProvider';

const COLS = [
  { f: 'Men', title: "MEN'S COLLECTION", text: 'Modern. Refined. Timeless.', img: '/c0.webp' },
  { f: 'Women', title: "WOMEN'S COLLECTION", text: 'Grace in every detail.', img: '/c1.webp' },
  { f: 'New', title: 'NEW ARRIVALS', text: 'Fresh styles. New stories.', img: '/c2.webp' },
];

export default function Collections() {
  const { showFilter } = useStore();
  return (
    <section id="collections" style={{ padding: '36px 0 20px' }}>
      <div className="wrap">
        <div className="cols">
          {COLS.map((c) => (
            <a key={c.f} className="col" href="#shop" onClick={() => showFilter(c.f)}>
              <div className="im" style={{ backgroundImage: `url(${asset(c.img)})` }} />
              <div><h3>{c.title}</h3><p>{c.text}</p><span>SHOP NOW →</span></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
