'use client';
import { inr } from '@/lib/products';
import type { Product } from '@/types/product';
import HeartIcon from './HeartIcon';
import ProductImage from './ProductImage';
import { useStore } from './StoreProvider';

export default function ProductCard({ p }: { p: Product }) {
  const { wish, setModalId, toggleWish, addToCart } = useStore();
  return (
    <div className="card">
      <div className="ph" onClick={() => setModalId(p.id)}>
        {p.isNew && <span className="nb">NEW</span>}
        <ProductImage src={p.image} alt={p.name} />
        <button className={`wl${wish.includes(p.id) ? ' on' : ''}`} aria-label="Wishlist" onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}><HeartIcon /></button>
        <button className="qa" onClick={(e) => { e.stopPropagation(); addToCart(p.id); }}>QUICK ADD</button>
      </div>
      <div className="m">
        <div className="cat">{p.gender} · {p.category}</div>
        <h3>{p.name}</h3>
        <div>{inr(p.price)}</div>
        <div className="sz">{p.sizes.join(' · ')}</div>
      </div>
    </div>
  );
}
