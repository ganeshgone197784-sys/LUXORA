'use client';
import { useState, type CSSProperties, type FormEvent } from 'react';
import { inr, products } from '@/lib/products';
import { useStore } from './StoreProvider';

const input: CSSProperties = {
  width: '100%', padding: 11, margin: '4px 0 12px', background: 'transparent',
  color: 'inherit', border: '1px solid var(--ln)', font: 'inherit',
};

export default function CheckoutModal() {
  const { checkoutOpen, setCheckoutOpen, cart, user, placeOrder } = useStore();
  const [f, setF] = useState({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [doneId, setDoneId] = useState('');

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const close = () => { setCheckoutOpen(false); setErr(''); setDoneId(''); };

  const subtotal = cart.reduce((a, c) => a + (products.find((p) => p.id === c.id)?.price ?? 0) * c.qty, 0);
  const shipping = subtotal >= 10000 || subtotal === 0 ? 0 : 199;
  const fullName = (user?.user_metadata as { full_name?: string } | undefined)?.full_name ?? '';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    const r = await placeOrder({ ...f, name: f.name || fullName });
    setBusy(false);
    if (r.ok) setDoneId(r.orderId ?? ''); else setErr(r.message);
  };

  return (
    <div className={`md${checkoutOpen ? ' open' : ''}`} style={checkoutOpen ? { background: '#000a' } : undefined}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="mc" style={{ gridTemplateColumns: '1fr', maxWidth: 460 }}>
        <button className="x" onClick={close} aria-label="Close">×</button>
        <div className="info">
          <div className="eyebrow">Checkout · Demo</div>
          {doneId ? (
            <>
              <h2>Order placed</h2>
              <p style={{ margin: '8px 0' }}>Your demo order <b>#{doneId.slice(0, 8).toUpperCase()}</b> is saved. No payment was taken.</p>
              <p className="note">You can see it under Account → My orders.</p>
              <button className="btn p" style={{ width: '100%', marginTop: 14 }} onClick={close}>CONTINUE SHOPPING</button>
            </>
          ) : (
            <form onSubmit={submit}>
              <h2>Shipping details</h2>
              <label>Full name</label>
              <input style={input} value={f.name || fullName} onChange={set('name')} required minLength={2} autoComplete="name" />
              <label>Phone</label>
              <input style={input} value={f.phone} onChange={set('phone')} required inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" />
              <label>Address</label>
              <input style={input} value={f.address} onChange={set('address')} required minLength={5} autoComplete="street-address" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label>City</label><input style={input} value={f.city} onChange={set('city')} required autoComplete="address-level2" /></div>
                <div><label>State</label><input style={input} value={f.state} onChange={set('state')} required autoComplete="address-level1" /></div>
              </div>
              <label>Pincode</label>
              <input style={input} value={f.pincode} onChange={set('pincode')} required inputMode="numeric" maxLength={6} pattern="[0-9]{6}" autoComplete="postal-code" />
              <div style={{ borderTop: '1px solid var(--ln)', paddingTop: 10, marginBottom: 12, fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal (estimate)</span><span>{inr(subtotal)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>{shipping ? inr(shipping) : 'Free'}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><b>Total (estimate)</b><b>{inr(subtotal + shipping)}</b></div>
                <p className="note">Final prices and stock are checked by the server when you place the order.</p>
              </div>
              {err && <p style={{ color: '#d9534f', fontSize: 13, marginBottom: 10 }}>{err}</p>}
              <button className="btn p" style={{ width: '100%' }} disabled={busy || cart.length === 0}>{busy ? 'PLACING ORDER…' : 'PLACE DEMO ORDER'}</button>
              <p className="note" style={{ textAlign: 'center' }}>Demo checkout — no real payment is processed.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
