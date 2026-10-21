'use client';
import { products } from '@/lib/products';
import type { SortKey } from '@/types/product';
import ProductCard from './ProductCard';
import { useStore } from './StoreProvider';

export default function ProductGrid() {
  const { filter, query, sort, setFilter, setSort } = useStore();
  const chips = ['All', 'Men', 'Women', 'New', ...Array.from(new Set(products.map((p) => p.category)))];
  const q = query.toLowerCase();

  let list = products.filter((p) =>
    (filter === 'All' || p.gender === filter || p.category === filter || (filter === 'New' && p.isNew)) &&
    `${p.name} ${p.category} ${p.gender}`.toLowerCase().includes(q));
  if (sort) list = [...list].sort((a, b) => (sort === 'asc' ? a.price - b.price : b.price - a.price));

  return (
    <section id="shop" style={{ paddingTop: 20 }}>
      <div className="wrap">
        <div className="sh"><h2>FEATURED PRODUCTS</h2><hr /><a href="#shop" onClick={() => setFilter('All')}>VIEW ALL →</a></div>
        <div className="tools">
          {chips.map((c) => <button key={c} className={`chip${filter === c ? ' on' : ''}`} onClick={() => setFilter(c)}>{c.toUpperCase()}</button>)}
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort products">
            <option value="">Sort: Featured</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
        <div className="grid">
          {list.length ? list.map((p) => <ProductCard key={p.id} p={p} />) : (
            <div className="empty" style={{ gridColumn: '1/-1' }}><div className="serif">No pieces found</div>Try a different search or filter.</div>
          )}
        </div>
      </div>
    </section>
  );
}
