'use client';
import { inr, products } from '@/lib/products';
import ProductImage from './ProductImage';
import { useStore } from './StoreProvider';

export default function ShoppingCart() {
  const { cart, changeQty, removeItem, clearCart, closeAll, notify, backendOn, user, setAuthOpen, setCheckoutOpen } = useStore();
  const rows = cart.flatMap((c, index) => {
    const p = products.find((x) => x.id === c.id);
    return p ? [{ c, p, index }] : [];
  });
  const subtotal = rows.reduce((a, r) => a + r.p.price * r.c.qty, 0);

  const goCheckout = () => {
    closeAll();
    if (!backendOn) { clearCart(); notify('Demo order placed — no payment taken'); return; }
    if (!user) { setAuthOpen(true); notify('Please log in to place your order'); return; }
    setCheckoutOpen(true);
  };

  if (!rows.length) {
    return <div className="bd"><div className="empty"><div className="serif">Your bag is empty</div>Discover something beautiful.</div></div>;
  }
  return (
    <>
      <div className="bd">
        {rows.map(({ c, p, index }) => (
          <div className="li" key={`${c.id}-${c.size}-${c.color}`}>
            <div className="th"><ProductImage src={p.image} alt={p.name} /></div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 18 }}>{p.name}</h3>
              <div className="sz">{c.color} · {c.size}</div>
              <div>{inr(p.price)}</div>
              <div className="q"><button onClick={() => changeQty(index, -1)}>−</button><span>{c.qty}</span><button onClick={() => changeQty(index, 1)}>+</button></div>
            </div>
            <button aria-label="Remove" onClick={() => removeItem(index)}>×</button>
          </div>
        ))}
      </div>
      <div className="ft">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span>Subtotal</span><b>{inr(subtotal)}</b></div>
        <button className="btn p" style={{ width: '100%' }} onClick={goCheckout}>CHECKOUT</button>
        <p className="note">Demo checkout — no real payment is processed.</p>
      </div>
    </>
  );
}
