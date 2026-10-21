'use client';
import { useState } from 'react';
import { inr, products } from '@/lib/products';
import type { Product } from '@/types/product';
import ProductImage from './ProductImage';
import { useStore } from './StoreProvider';

function Body({ p }: { p: Product }) {
  const { addToCart, setModalId } = useStore();
  const [size, setSize] = useState(p.sizes[0]);
  const [color, setColor] = useState(p.colors[0]);
  return (
    <div className="mc">
      <button className="x" onClick={() => setModalId(null)} aria-label="Close">×</button>
      <div className="ph"><ProductImage src={p.image} alt={p.name} /></div>
      <div className="info">
        <div className="cat eyebrow">{p.gender} · {p.category}</div>
        <h2>{p.name}</h2>
        <div style={{ fontSize: 20 }}>{inr(p.price)}</div>
        <p style={{ margin: '12px 0' }}>{p.description}</p>
        <div className="eyebrow">Size</div>
        <div className="opt">{p.sizes.map((s) => <button key={s} className={s === size ? 'on' : ''} onClick={() => setSize(s)}>{s}</button>)}</div>
        <div className="eyebrow">Colour</div>
        <div className="opt">{p.colors.map((c) => <button key={c} className={c === color ? 'on' : ''} onClick={() => setColor(c)}>{c}</button>)}</div>
        <p className="note" style={{ margin: '0 0 12px' }}>{p.stock <= 5 ? `Only ${p.stock} left` : 'In stock'} · Demo item</p>
        <button className="btn p" style={{ width: '100%' }} onClick={() => { addToCart(p.id, size, color); setModalId(null); }}>ADD TO BAG</button>
      </div>
    </div>
  );
}

export default function ProductModal() {
  const { modalId, setModalId } = useStore();
  const p = products.find((x) => x.id === modalId);
  return (
    <div className={`md${p ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setModalId(null); }}>
      {p && <Body key={p.id} p={p} />}
    </div>
  );
}
