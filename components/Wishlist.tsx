'use client';
import { inr, products } from '@/lib/products';
import ProductImage from './ProductImage';
import { useStore } from './StoreProvider';

export default function Wishlist() {
  const { wish, toggleWish, addToCart } = useStore();
  const items = wish.flatMap((id) => products.filter((p) => p.id === id));
  if (!items.length) {
    return <div className="bd"><div className="empty"><div className="serif">Your wishlist is empty</div>Tap the heart on any piece to save it.</div></div>;
  }
  return (
    <div className="bd">
      {items.map((p) => (
        <div className="li" key={p.id}>
          <div className="th"><ProductImage src={p.image} alt={p.name} /></div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 18 }}>{p.name}</h3>
            <div>{inr(p.price)}</div>
            <button className="chip" style={{ marginTop: 6 }} onClick={() => addToCart(p.id)}>ADD TO BAG</button>
          </div>
          <button aria-label="Remove" onClick={() => toggleWish(p.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
