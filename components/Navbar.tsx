'use client';
import { useEffect, useRef, useState } from 'react';
import { useStore } from './StoreProvider';

export default function Navbar() {
  const { cartCount, wish, query, search, showFilter, setDrawer, notify } = useStore();
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (searchOpen) input.current?.focus(); }, [searchOpen]);
  const pick = (f: string) => { showFilter(f); setMenu(false); };

  return (
    <header>
      <div className="wrap nav">
        <button id="burger" className="ic" aria-label="Menu" onClick={() => setMenu((m) => !m)} style={{ margin: 0, width: 40, height: 40, placeItems: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
        </button>
        <a href="#top" className="lg" aria-label="LUXORA">
          <svg viewBox="0 0 24 16"><path d="M2 14l-1-10 6 5 5-8 5 8 6-5-1 10z" /></svg>
          <b>LUXORA</b>
          <small>ELEGANCE BEYOND ORDINARY</small>
        </a>
        <nav className={`links${menu ? ' open' : ''}`}>
          <a href="#shop" onClick={() => pick('Men')}>MEN</a>
          <a href="#shop" onClick={() => pick('Women')}>WOMEN</a>
          <a href="#shop" onClick={() => pick('New')}>NEW ARRIVALS</a>
          <a href="#collections" onClick={() => setMenu(false)}>COLLECTIONS</a>
        </nav>
        <div className="ic">
          <button aria-label="Search" onClick={() => setSearchOpen((s) => !s)}>
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          </button>
          <button aria-label="Account" onClick={() => notify('Accounts arrive with the backend phase')}>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
          </button>
          <button aria-label="Wishlist" onClick={() => setDrawer('wish')}>
            <svg viewBox="0 0 24 24"><path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z" /></svg>
            <span className="n">{wish.length}</span>
          </button>
          <button aria-label="Bag" onClick={() => setDrawer('cart')}>
            <svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6zM9 8a3 3 0 016 0" /></svg>
            <span className="n">{cartCount}</span>
          </button>
        </div>
      </div>
      <div id="sbar" className={searchOpen ? 'open' : ''}>
        <div className="wrap">
          <input id="q" ref={input} type="search" placeholder="Search LUXORA…" value={query}
            onChange={(e) => { search(e.target.value); if (e.target.value) document.getElementById('shop')?.scrollIntoView(); }} />
        </div>
      </div>
    </header>
  );
}
