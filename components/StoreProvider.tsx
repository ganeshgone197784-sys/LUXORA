'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { products } from '@/lib/products';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { CartItem, Product, SortKey } from '@/types/product';

type Drawer = 'cart' | 'wish' | null;

export interface AuthResult { ok: boolean; message: string }

interface DbProduct {
  id: number; name: string; description: string | null; price_inr: number; gender: 'Men' | 'Women';
  image_url: string | null; sizes: string[]; colors: string[]; stock: number; is_new: boolean;
  categories: { name: string } | null;
}

interface Store {
  user: User | null;
  backendOn: boolean;
  catalogSource: 'database' | 'demo';
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  cart: CartItem[];
  wish: number[];
  cartCount: number;
  filter: string;
  query: string;
  sort: SortKey;
  drawer: Drawer;
  modalId: number | null;
  toast: string;
  toastOn: boolean;
  setSort: (s: SortKey) => void;
  setFilter: (f: string) => void;
  search: (q: string) => void;
  showFilter: (f: string) => void;
  setDrawer: (d: Drawer) => void;
  setModalId: (id: number | null) => void;
  closeAll: () => void;
  addToCart: (id: number, size?: string, color?: string) => void;
  changeQty: (index: number, delta: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  toggleWish: (id: number) => void;
  notify: (msg: string) => void;
}

const Ctx = createContext<Store | null>(null);

export function useStore(): Store {
  const c = useContext(Ctx);
  if (!c) throw new Error('useStore must be used inside StoreProvider');
  return c;
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked */ }
}

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wish, setWish] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('');
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [modalId, setModalId] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const [toastOn, setToastOn] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setCart(load<CartItem[]>('lx_cart', []));
    setWish(load<number[]>('lx_wish', []));
    setReady(true);
  }, []);
  useEffect(() => { if (ready) save('lx_cart', cart); }, [cart, ready]);
  useEffect(() => { if (ready) save('lx_wish', wish); }, [wish, ready]);

  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [catalogSource, setCatalogSource] = useState<'database' | 'demo'>('demo');

  // Load products from Supabase (falls back to demo products if anything fails)
  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('products')
      .select('id,name,description,price_inr,gender,image_url,sizes,colors,stock,is_new,categories(name)')
      .eq('is_active', true)
      .order('id')
      .then(({ data, error }) => {
        if (error || !data || data.length === 0) return;
        const rows = data as unknown as DbProduct[];
        const mapped: Product[] = rows.map((r) => ({
          id: r.id, name: r.name, gender: r.gender, category: r.categories?.name ?? 'Other',
          price: r.price_inr, image: r.image_url ?? '', sizes: r.sizes, colors: r.colors,
          stock: r.stock, description: r.description ?? '', isNew: r.is_new,
        }));
        products.splice(0, products.length, ...mapped); // shared catalogue used by all components
        setCatalogSource('database');
      });
  }, []);

  // Keep login state in sync
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { ok: false, message: 'Backend is not connected.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { ok: false, message: error.message } : { ok: true, message: 'Logged in' };
  };

  const signUp = async (name: string, email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { ok: false, message: 'Backend is not connected.' };
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (error) return { ok: false, message: error.message };
    if (!data.session) return { ok: true, message: 'Account created. Check your email to confirm, then log in.' };
    return { ok: true, message: 'Account created. You are logged in.' };
  };

  const signOut = async () => { if (supabase) await supabase.auth.signOut(); notify('Logged out'); };

  const notify = useCallback((msg: string) => {
    setToast(msg);
    setToastOn(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastOn(false), 2200);
  }, []);

  const closeAll = useCallback(() => { setDrawer(null); setModalId(null); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAll(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeAll]);

  const inCart = (id: number) => cart.filter((c) => c.id === id).reduce((a, c) => a + c.qty, 0);

  const addToCart = (id: number, size?: string, color?: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    if (inCart(id) >= p.stock) return notify(`Only ${p.stock} in stock (demo)`);
    const sz = size ?? p.sizes[0];
    const co = color ?? p.colors[0];
    setCart((prev) => {
      const i = prev.findIndex((c) => c.id === id && c.size === sz && c.color === co);
      if (i >= 0) return prev.map((c, k) => (k === i ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { id, size: sz, color: co, qty: 1 }];
    });
    notify(`Added to bag — ${p.name}`);
  };

  const changeQty = (index: number, delta: number) => {
    const item = cart[index];
    const p = item && products.find((x) => x.id === item.id);
    if (!item || !p) return;
    if (delta > 0 && inCart(item.id) >= p.stock) return notify('Max stock reached');
    setCart((prev) => prev.map((c, k) => (k === index ? { ...c, qty: c.qty + delta } : c)).filter((c) => c.qty > 0));
  };

  const removeItem = (index: number) => setCart((prev) => prev.filter((_, k) => k !== index));
  const clearCart = () => setCart([]);

  const toggleWish = (id: number) => {
    const has = wish.includes(id);
    setWish(has ? wish.filter((x) => x !== id) : [...wish, id]);
    notify(has ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const search = (q: string) => { setQuery(q); setFilter('All'); };
  const showFilter = (f: string) => { setFilter(f); setQuery(''); };

  const value: Store = {
    cart, wish, cartCount: cart.reduce((a, c) => a + c.qty, 0), filter, query, sort, drawer, modalId, toast, toastOn,
    user, backendOn: !!supabase, catalogSource, authOpen, setAuthOpen, signIn, signUp, signOut,
    setSort, setFilter, search, showFilter, setDrawer, setModalId, closeAll, addToCart, changeQty, removeItem, clearCart, toggleWish, notify,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
