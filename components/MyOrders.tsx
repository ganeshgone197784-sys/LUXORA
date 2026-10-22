'use client';
import { useEffect, useState } from 'react';
import { inr } from '@/lib/products';
import { supabase } from '@/lib/supabase';

interface Row {
  id: string; status: string; total_inr: number; created_at: string;
  order_items: { product_name: string; qty: number; size: string; color: string }[];
}

export default function MyOrders({ userId }: { userId: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase
      .from('orders')
      .select('id,status,total_inr,created_at,order_items(product_name,qty,size,color)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setErr(error.message);
        else setRows(data as unknown as Row[]);
      });
    return () => { alive = false; };
  }, [userId]);

  return (
    <div style={{ marginTop: 22 }}>
      <div className="eyebrow">My orders</div>
      {err && <p className="note">Could not load orders: {err}</p>}
      {!err && rows === null && <p className="note">Loading…</p>}
      {rows && rows.length === 0 && <p className="note">No orders yet.</p>}
      {rows?.map((o) => (
        <div key={o.id} style={{ borderTop: '1px solid var(--ln)', padding: '12px 0', fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <b>#{o.id.slice(0, 8).toUpperCase()}</b>
            <span style={{ color: 'var(--g)', textTransform: 'uppercase', letterSpacing: '.1em', fontSize: 11 }}>{o.status}</span>
          </div>
          <div className="note" style={{ margin: '2px 0 6px' }}>{new Date(o.created_at).toLocaleDateString('en-IN')} · Demo order</div>
          {o.order_items.map((i, k) => <div key={k}>{i.qty} × {i.product_name} <span className="sz">({i.color}, {i.size})</span></div>)}
          <div style={{ marginTop: 6 }}>Total: <b>{inr(o.total_inr)}</b></div>
        </div>
      ))}
    </div>
  );
}
