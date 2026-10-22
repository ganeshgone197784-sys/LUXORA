'use client';
import { useCallback, useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { asset } from '@/lib/asset';
import { inr } from '@/lib/products';
import { supabase } from '@/lib/supabase';

// NOTE: this page only *shows* the admin screen. The real protection is in the
// database (Row Level Security): non-admins cannot change anything even if they open this page.

interface AProduct {
  id: number; name: string; description: string; price_inr: number; gender: 'Men' | 'Women';
  category_id: number | null; image_url: string | null; sizes: string[]; colors: string[];
  stock: number; is_new: boolean; is_active: boolean; categories: { name: string } | null;
}
interface Cat { id: number; name: string }
interface AOrder {
  id: string; status: string; total_inr: number; created_at: string;
  shipping_name: string; shipping_phone: string; shipping_address: string;
  shipping_city: string; shipping_state: string; shipping_pincode: string;
  order_items: { product_name: string; qty: number; size: string; color: string }[];
}
interface Form {
  id?: number; name: string; description: string; price: string; gender: 'Men' | 'Women';
  category_id: string; image_url: string; sizes: string; colors: string; stock: string;
  is_new: boolean; is_active: boolean;
}

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const emptyForm: Form = {
  name: '', description: '', price: '', gender: 'Men', category_id: '', image_url: '',
  sizes: 'S, M, L', colors: 'Black', stock: '10', is_new: false, is_active: true,
};
const input: CSSProperties = {
  width: '100%', padding: 10, margin: '4px 0 12px', background: 'transparent',
  color: 'inherit', border: '1px solid var(--ln)', font: 'inherit',
};
const card: CSSProperties = { border: '1px solid var(--ln)', background: 'var(--sf)', padding: 14, marginBottom: 12 };

export default function AdminDashboard() {
  const [gate, setGate] = useState<'loading' | 'nobackend' | 'nologin' | 'denied' | 'ok'>('loading');
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<AProduct[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [orders, setOrders] = useState<AOrder[]>([]);
  const [form, setForm] = useState<Form | null>(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) { setGate('nobackend'); return; }
    const sb = supabase;
    let alive = true;
    (async () => {
      const { data: s } = await sb.auth.getSession();
      if (!s.session) { if (alive) setGate('nologin'); return; }
      const { data, error } = await sb.from('profiles').select('is_admin').eq('id', s.session.user.id).single();
      if (alive) setGate(!error && data?.is_admin ? 'ok' : 'denied');
    })();
    return () => { alive = false; };
  }, []);

  const loadAll = useCallback(async () => {
    if (!supabase) return;
    const [p, c, o] = await Promise.all([
      supabase.from('products')
        .select('id,name,description,price_inr,gender,category_id,image_url,sizes,colors,stock,is_new,is_active,categories(name)')
        .order('id'),
      supabase.from('categories').select('id,name').order('name'),
      supabase.from('orders')
        .select('id,status,total_inr,created_at,shipping_name,shipping_phone,shipping_address,shipping_city,shipping_state,shipping_pincode,order_items(product_name,qty,size,color)')
        .order('created_at', { ascending: false }).limit(100),
    ]);
    const err = p.error || c.error || o.error;
    if (err) setMsg('Could not load data: ' + err.message);
    setProducts((p.data ?? []) as unknown as AProduct[]);
    setCats((c.data ?? []) as unknown as Cat[]);
    setOrders((o.data ?? []) as unknown as AOrder[]);
  }, []);
  useEffect(() => { if (gate === 'ok') void loadAll(); }, [gate, loadAll]);

  const edit = (p?: AProduct) => {
    setMsg('');
    setForm(p ? {
      id: p.id, name: p.name, description: p.description, price: String(p.price_inr), gender: p.gender,
      category_id: p.category_id ? String(p.category_id) : '', image_url: p.image_url ?? '',
      sizes: p.sizes.join(', '), colors: p.colors.join(', '), stock: String(p.stock),
      is_new: p.is_new, is_active: p.is_active,
    } : emptyForm);
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase || !form) return;
    const price = Number(form.price), stock = Number(form.stock);
    const sizes = form.sizes.split(',').map((s) => s.trim()).filter(Boolean);
    const colors = form.colors.split(',').map((s) => s.trim()).filter(Boolean);
    if (form.name.trim().length < 2) return setMsg('Enter a product name.');
    if (!Number.isInteger(price) || price < 0) return setMsg('Price must be a whole number (₹).');
    if (!Number.isInteger(stock) || stock < 0) return setMsg('Stock must be a whole number.');
    if (!sizes.length || !colors.length) return setMsg('Add at least one size and one colour.');
    if (form.image_url.trim() && !form.image_url.trim().startsWith('https://')) return setMsg('Image URL must start with https://');
    const row = {
      name: form.name.trim(), description: form.description.trim(), price_inr: price, gender: form.gender,
      category_id: form.category_id ? Number(form.category_id) : null,
      image_url: form.image_url.trim() || null, sizes, colors, stock, is_new: form.is_new, is_active: form.is_active,
    };
    setBusy(true);
    const q = form.id ? supabase.from('products').update(row).eq('id', form.id) : supabase.from('products').insert(row);
    const { data, error } = await q.select('id');
    setBusy(false);
    if (error) return setMsg(error.message);
    if (!data || data.length === 0) return setMsg('Not allowed (admin only).');
    setForm(null);
    setMsg(form.id ? 'Product updated.' : 'Product added.');
    void loadAll();
  };

  const remove = async (p: AProduct) => {
    if (!supabase || !window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('products').delete().eq('id', p.id);
    if (error) {
      setMsg(error.code === '23503'
        ? 'This product is in past orders, so it cannot be deleted. Edit it and turn Active off to hide it instead.'
        : error.message);
      return;
    }
    setMsg('Product deleted.');
    void loadAll();
  };

  const setStatus = async (o: AOrder, status: string) => {
    if (!supabase) return;
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', o.id).select('id');
    if (error) return setMsg(error.message);
    if (!data || data.length === 0) return setMsg('Not allowed (admin only).');
    setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status } : x)));
    setMsg(`Order #${o.id.slice(0, 8).toUpperCase()} marked ${status}.`);
  };

  const f = form;
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setForm(f ? { ...f, [k]: e.target.value } : f);

  return (
    <div className="wrap" style={{ padding: '24px 20px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 32 }}>LUXORA Admin</h1>
        <a className="btn" href={asset('/')}>← STORE</a>
      </div>

      {gate === 'loading' && <p>Checking access…</p>}
      {gate === 'nobackend' && <p>The database is not connected on this site. Open the admin page on your Vercel site.</p>}
      {gate === 'nologin' && <p>Please log in on the store first (account icon), then open this page again.</p>}
      {gate === 'denied' && <p>Access denied. This account is not an admin.</p>}

      {gate === 'ok' && (
        <>
          <div className="tools">
            <button className={`chip${tab === 'products' ? ' on' : ''}`} onClick={() => setTab('products')}>PRODUCTS ({products.length})</button>
            <button className={`chip${tab === 'orders' ? ' on' : ''}`} onClick={() => setTab('orders')}>ORDERS ({orders.length})</button>
          </div>
          {msg && <p style={{ color: 'var(--g)', marginBottom: 14, fontSize: 14 }}>{msg}</p>}

          {tab === 'products' && (
            <>
              <button className="btn p" style={{ marginBottom: 16 }} onClick={() => edit()}>+ ADD PRODUCT</button>
              {products.map((p) => (
                <div key={p.id} style={{ ...card, opacity: p.is_active ? 1 : 0.55 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <b>{p.name}</b><span>{inr(p.price_inr)}</span>
                  </div>
                  <div className="note" style={{ margin: '2px 0 10px' }}>
                    {p.gender} · {p.categories?.name ?? 'No category'} · Stock: <b>{p.stock}</b>
                    {p.is_new ? ' · NEW' : ''}{p.is_active ? '' : ' · HIDDEN'}
                  </div>
                  <button className="chip" onClick={() => edit(p)}>EDIT</button>{' '}
                  <button className="chip" onClick={() => remove(p)}>DELETE</button>
                </div>
              ))}
            </>
          )}

          {tab === 'orders' && (
            <>
              {orders.length === 0 && <p>No orders yet.</p>}
              {orders.map((o) => (
                <div key={o.id} style={card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <b>#{o.id.slice(0, 8).toUpperCase()}</b><b>{inr(o.total_inr)}</b>
                  </div>
                  <div className="note" style={{ margin: '2px 0 8px' }}>{new Date(o.created_at).toLocaleString('en-IN')}</div>
                  {o.order_items.map((i, k) => <div key={k} style={{ fontSize: 14 }}>{i.qty} × {i.product_name} <span className="sz">({i.color}, {i.size})</span></div>)}
                  <div style={{ fontSize: 13, margin: '8px 0', color: 'var(--mg)' }}>
                    {o.shipping_name} · {o.shipping_phone}<br />
                    {o.shipping_address}, {o.shipping_city}, {o.shipping_state} {o.shipping_pincode}
                  </div>
                  <select style={{ marginLeft: 0 }} value={o.status} onChange={(e) => setStatus(o, e.target.value)} aria-label="Order status">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              ))}
              <p className="note">Note: cancelling an order does not put the stock back automatically. Update stock in Products if needed.</p>
            </>
          )}
        </>
      )}

      <div className={`md${f ? ' open' : ''}`} style={f ? { background: '#000a' } : undefined}
        onClick={(e) => { if (e.target === e.currentTarget) setForm(null); }}>
        <div className="mc" style={{ gridTemplateColumns: '1fr', maxWidth: 520 }}>
          <button className="x" onClick={() => setForm(null)} aria-label="Close">×</button>
          {f && (
            <form className="info" onSubmit={save}>
              <div className="eyebrow">{f.id ? 'Edit product' : 'Add product'}</div>
              <label>Name</label><input style={input} value={f.name} onChange={set('name')} required />
              <label>Description</label><input style={input} value={f.description} onChange={set('description')} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label>Price (₹)</label><input style={input} inputMode="numeric" value={f.price} onChange={set('price')} required /></div>
                <div><label>Stock</label><input style={input} inputMode="numeric" value={f.stock} onChange={set('stock')} required /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label>Gender</label>
                  <select style={{ ...input, marginLeft: 0 }} value={f.gender} onChange={set('gender')}><option>Men</option><option>Women</option></select></div>
                <div><label>Category</label>
                  <select style={{ ...input, marginLeft: 0 }} value={f.category_id} onChange={set('category_id')}>
                    <option value="">None</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select></div>
              </div>
              <label>Image URL (https://…)</label><input style={input} value={f.image_url} onChange={set('image_url')} />
              <label>Sizes (comma separated)</label><input style={input} value={f.sizes} onChange={set('sizes')} />
              <label>Colours (comma separated)</label><input style={input} value={f.colors} onChange={set('colors')} />
              <label style={{ display: 'block', marginBottom: 8 }}><input type="checkbox" checked={f.is_new} onChange={(e) => setForm({ ...f, is_new: e.target.checked })} /> Mark as NEW</label>
              <label style={{ display: 'block', marginBottom: 14 }}><input type="checkbox" checked={f.is_active} onChange={(e) => setForm({ ...f, is_active: e.target.checked })} /> Active (visible in store)</label>
              {msg && <p style={{ color: '#d9534f', fontSize: 13, marginBottom: 10 }}>{msg}</p>}
              <button className="btn p" style={{ width: '100%' }} disabled={busy}>{busy ? 'SAVING…' : 'SAVE PRODUCT'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
